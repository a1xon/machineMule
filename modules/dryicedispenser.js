const delay = require('delay');
const {Component} = require('./component.js');

class Dryicedispenser extends Component {
    constructor (statusLEDS = [], strip, GPIO) {
        super(statusLEDS, strip);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && drink.DryIce >= 1) {
            this.showStatus(true);
            await delay(2000);
            return 'dryice dispensed'
        }
        this.showStatus(false);
        return false
    }
}

exports.Dryicedispenser = Dryicedispenser;