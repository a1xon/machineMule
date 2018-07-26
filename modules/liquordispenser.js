const delay = require('delay');
const {Component} = require('./component.js');

class Liquordispenser extends Component {
    constructor (statusLEDS, strip, GPIO) {
        super(statusLEDS, strip);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && (drink.Vodka >= 1 || drink.Gin >= 1)) {
            this.showStatus(true);
            await delay(2500);
            return `liquor dispensed ${(drink.Vodka | 0 + drink.Gin | 0)} ml`
        }
        this.showStatus(false);
        return false
    }
}

exports.Liquordispenser = Liquordispenser;