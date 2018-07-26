const delay = require('delay');
const {Component} = require('./component.js');

class Gingerbeerdispenser extends Component {
    constructor (statusLEDS, strip, GPIO) {
        super(statusLEDS, strip);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && drink.GingerBeer >= 1) {
            this.showStatus(true);
            await delay(4000);
            return 'gingerbeer dispensed'
        }
        this.showStatus(false);
        return false
    }
}

exports.Gingerbeerdispenser = Gingerbeerdispenser;