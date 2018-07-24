const five = require('johnny-five');
const prompts = require('prompts');

const {
    Drink
} = require('./modules/drink');
const {
    Recipes
} = require('./recipes')
const {
    Questions
} = require('./promptquestions');

///Machine Components
const {
    Table
} = require('./modules/table');
const {
    Cupdispenser
} = require('./modules/cupdispenser');
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


let machineIsActive = false;
let drinksOrders = [];
let drinksActive = [];
let drinksLog = [];

const table = new Table();

///Here we can alter the machine layout by just switching the order of the constructor functions
const machineComponents = [
    new Cupdispenser(),
    new Cucumberslicer(),
    new Liquordispenser(),
    new Gingerbeerdispenser(),
    new Stirrer()
]

const runMachineCycle = async () => {
    ///Add new mule to active list if there are orders
    machineIsActive = true;
    if (drinksOrders.length) {
        drinksActive.push(drinksOrders.shift());
    }

    ///Update position of the mules
    for (let drink of drinksActive) {
        drink.position = drink.position >= 0 ? (drink.position + 1) : 0;
    }

    //Give components their duty
    //Loading up duties array with promises from components
    //Giving each component the drink that sits in his place
    let duties = [];
    for (let i = 0; i < machineComponents.length; i++) {
        duties.push(machineComponents[i].duty(drinksActive.find(drink => drink.position === i)))
    }
    //Wait for all components to complete
    let result = await Promise.all(duties);
    console.log(result);

    ///Spin table
    await table.spin();
    console.log('spinnend');
    
    ///transfer completed drinks to log
    if (drinksActive.some(drink => drink.position >= machineComponents.length-1)) {
        drinksLog.push(drinksActive.shift());
    }

    if (drinksActive.length > 0) {
        runMachineCycle();
        return
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