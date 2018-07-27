const five = require('johnny-five');
const pixel = require("node-pixel");

const prompts = require('prompts');
const delay = require('delay');
const moment = require('moment');


const {
    Drink
} = require('./modules/drink');
const {
    Recipes
} = require('./recipes')
const {
    Questions
} = require('./promptquestions');

///
/// Machine Components
///

const {
    Table
} = require('./modules/table');
const {
    Cupdispenser
} = require('./modules/cupdispenser');
const {
    Dryicedispenser
} = require('./modules/dryicedispenser');
const {
    Cucumberslicer
} = require('./modules/cucumberslicer');
const {
    Liquordispenser
} = require('./modules/liquordispenser');
const {
    Gingerbeerdispenser
} = require('./modules/gingerbeerdispenser');
const {
    Stirrer
} = require('./modules/stirrer');
const {
    WiringSettings
} = require('./settings')

///
/// Start of the program


let machineIsActive = false;
let drinksOrders = [];
let drinksActive = [];
let drinksLog = [];

const table = new Table();

const board = new five.Board();

board.on("ready", async function () {

    console.log("Board ready, lets add light");

    const strip = new pixel.Strip({
        color_order: pixel.COLOR_ORDER.GRB,
        board: this,
        controller: "I2CBACKPACK",
        strips: [WiringSettings.statusLedsPerModule * WiringSettings.NumberOfComponents],
    });

    strip.on("ready", async function () {

        let assignedStatusLEDs = 0;
        let userCredit = 0;

        const assignStatusLEDs = () => {
            let arr = Array.from({
                length: WiringSettings.statusLedsPerModule
            }, (x, i) => strip.pixel(assignedStatusLEDs + i));
            assignedStatusLEDs += WiringSettings.statusLedsPerModule;
            return arr;

        }

        ///
        /// ---------------------------------------------------------------------------------------------
        ///
        /// Here we can alter the machine layout by just switching the order of the constructor functions
        ///
        /// ---------------------------------------------------------------------------------------------
        ///

        const machineComponents = [
            new Cupdispenser(assignStatusLEDs(), strip),
            new Cucumberslicer(assignStatusLEDs(), strip),
            new Dryicedispenser(assignStatusLEDs(), strip),
            new Liquordispenser(assignStatusLEDs(), strip),
            new Gingerbeerdispenser(assignStatusLEDs(), strip),
            new Stirrer(assignStatusLEDs(), strip)
        ];

        ///
        /// -------------------------------------
        ///

        const coinInserted = async coinValue => {
            let paidDrinkIndex = -1;
            let creditSufficient = false;

            userCredit += coinValue;
            if (coinValue === 0) {
                drinksOrders.forEach(drink => drink.setAsPaid());
                creditSufficient = true;
            } else {
                do {
                    paidDrinkIndex = drinksOrders.findIndex(drink => drink.price <= userCredit);
                    if (paidDrinkIndex > -1) {
                        userCredit -= drinksOrders[paidDrinkIndex].price;
                        drinksOrders[paidDrinkIndex].setAsPaid();
                        creditSufficient = true;
                    }
                } while (paidDrinkIndex > -1);
            }

            /// run machine 
            if (!machineIsActive && creditSufficient) {
                runMachineCycle();
            }
        }

        const runMachineCycle = async () => {


            machineIsActive = true;

            /// Add new mule to active list if there are paid orders left
            let paidDrinkIndex = -1;
            paidDrinkIndex = drinksOrders.findIndex(drink => drink.paid === true);
            drinksActive.push(drinksOrders.splice(paidDrinkIndex, 1));

            /// Update position of the mules

            for (let drink of drinksActive) {
                drink.position = drink.position >= 0 ? (drink.position + 1) : 0;
            }

            // Give components their duty and let them decide what to with the drink
            // Loading up duties array with promises from components
            // Giving each component the drink that sits in his place

            let duties = [];
            for (let [componentPosition, component] of machineComponents.entries()) {
                duties.push(component.duty(drinksActive.find(drink => drink.position === componentPosition)))
            }

            // Wait for all components to complete

            let result = await Promise.all(duties);
            console.log(result);

            /// Spin table

            await table.spin();
            console.log('spinnend');

            /// Transfer completed drinks to log

            if (drinksActive.some(drink => drink.position >= machineComponents.length - 1)) {
                drinksActive[0].setAsServed();
                drinksLog.push(drinksActive.shift());
            }

            if (drinksActive.length > 0) {
                runMachineCycle();
            } else {
                machineIsActive = false;
            }
        }

        const promptUser = async () => {
            let response = await prompts(Questions);
            console.log(response);
            if (Number.isInteger(response.drink)) {
                /// Add funds to user credit
                coinInserted(response.drink);
            } else {
                for (let i = 0; i < response.amount; i++) {
                    drinksOrders.push(new Drink(Recipes[response.drink]));
                }
            }
            promptUser();
        }

        promptUser();
    });

});