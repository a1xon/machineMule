const moment = require('moment');

class Drink {
    constructor (recipe) {
        Object.assign(this, recipe);
        this.position = -1;
        this.date = moment();
    }
}

exports.Drink = Drink;