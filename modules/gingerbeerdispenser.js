const delay = require('delay');
const {Component} = require('./component.js');

class Gingerbeerdispenser extends Component {
    constructor (statusLEDS, GPIO) {
        super(statusLEDS);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && drink.GingerBeer >= 1) {
            await delay(4000);
            return 'gingerbeer dispensed'
        }
        return false
    }
}

exports.Gingerbeerdispenser = Gingerbeerdispenser;