const delay = require('delay');
const {Component} = require('./component.js');

class Stirrer extends Component {
    constructor (statusLEDS, GPIO) {
        super(statusLEDS);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && drink.Stirred) {
            await delay(2500);
            return 'stirred'
        }
        return false
    }
}

exports.Stirrer = Stirrer;