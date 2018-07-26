const fs = require('fs');
const { promisify } = require('util')
const appendFile = promisify(fs.appendFile)

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

    strip.on("ready", function () {

        let assignedStatusLEDs = 0;

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
            new Cupdispenser(assignStatusLEDs(),strip),
            new Cucumberslicer(assignStatusLEDs(),strip),
            new Dryicedispenser(assignStatusLEDs(),strip),
            new Liquordispenser(assignStatusLEDs(),strip),
            new Gingerbeerdispenser(assignStatusLEDs(),strip),
            new Stirrer(assignStatusLEDs(),strip)
        ];

        ///
        /// -------------------------------------
        ///

        const runMachineCycle = async () => {
            /// Add new mule to active list if there are orders left

            machineIsActive = true;
            if (drinksOrders.length) {
                drinksActive.push(drinksOrders.shift());
            }

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
                appendFile('./drinksLog/' + moment().format('YYYYMMDD') + '.prejson' , JSON.stringify(drinksActive[0]) + ',\n');
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
            for (let i = 0; i < response.amount; i++) {
                drinksOrders.push(new Drink(Recipes[response.drink]));
            }
            if (!machineIsActive) {
                runMachineCycle();
            }
            promptUser();
        }

        promptUser();
    });

});