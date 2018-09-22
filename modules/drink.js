const fs = require('fs');
const { promisify } = require('util')
const appendFile = promisify(fs.appendFile)

const moment = require('moment');

class Drink {
    constructor (recipe) {
        Object.assign(this, recipe);
        this.position = -1;
        this.paid = false;
        this.free = false;
        this.timePaid = '';
        this.timeOrdered = moment();
        this.timeServed = '';
    }

    async setAsPaid(actuallyPaid) {
        this.paid = moment();
        this.free = !actuallyPaid;
    }
    
    async setAsServed(){
        this.timeServed = moment();
        appendFile('./drinksLog/' + moment().format('YYYYMMDD') + '.prejson' , JSON.stringify(this) + ',\n');
    }
}

exports.Drink = Drink;