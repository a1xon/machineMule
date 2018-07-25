const five = require('johnny-five');
const prompts = require('prompts');
const delay = require('delay');

const statusLedsPerModule = 8;
let assignedLeds = 0;

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

const board = new five.Board();

board.on("ready", async function() {
    var rgb = new five.Led.RGB([6, 5, 3]);
    rgb.color('#FFFFFF');
    var index = 0;
    var rainbow = ['#FFFFFF',"#e8ffe8","#d1ffd1","#b9ffb9","#a2ffa2","#8bff8b","#74ff74","#5dff5d","#46ff46","#2eff2e","#17ff17",'#00FF00'];
    await delay(3000);
    for (color of rainbow) {
      rgb.color(color);
      await delay(15);
    }
    await delay(3000);
    rainbow = rainbow.reverse();
    for (color of rainbow) {
      rgb.color(color);
      await delay(15);
    }

  });

const assignLed = () => {
  let arr = Array.from({length: statusLedsPerModule}, (x,i) => new A(i + assignedLeds));
  assignedLeds += statusLedsPerModule;
  return arr;
}

///Here we can alter the machine layout by just switching the order of the constructor functions
const machineComponents = [
    new Cupdispenser(),
    new Cucumberslicer(),
    new Liquordispenser(),
    new Gingerbeerdispenser(),
    new Stirrer()
];

const runMachineCycle = async () => {
    ///Add new mule to active list if there are orders left
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
