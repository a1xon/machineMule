const five = require('johnny-five');
const prompts = require('prompts');

const {
    Drink
} = require('./modules/drink');
const {
    Table
} = require('./modules/table');
const {
    WiringSettings
} = require('./settings')
const {
    Recipes
} = require('./recipes')
const {
    Questions
} = require('./promptquestions');

const table = new Table();

let machineIsActive = false;
let mulesOrders = [];
let mulesActive = [];
let mulesLog = [];

mulesOrders.push(new Drink(Recipes.MoscowMule));
mulesOrders.push(new Drink(Recipes.CucumberOnly));

const runMachineCycle = async () => {
    ///Add new mule to active list if there are orders
    if (mulesOrders.length) {
        mulesActive.push(mulesOrders.shift());
    }

    ///update position of the mules
    for (mule of mulesActive) {
        mule.position = mule.position >= 0 ? (mule.position + 1) : 0
        if (mule.position >= 5) {
            mulesLog.push(mulesActive.shift());
        }
    }
    console.log(mulesActive);
    ///Spin table
    await table.spin();
    console.log('spinnend');
    if (mulesActive.length !== 0) {
        runMachineCycle();
        return
    } else {
        machineIsActive = false;
    }
}

(async () => {
    let response = await prompts(Questions);
    console.log(response);
})();
//runMachineCycle();