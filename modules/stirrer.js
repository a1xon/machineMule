const delay = require('delay');
const {Component} = require('./component.js');

class Stirrer extends Component {
    constructor (statusLEDS, strip, GPIO) {
        super(statusLEDS, strip);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && drink.Stirred) {
            this.showStatus(true);
            await delay(2500);
            return 'stirred'
        }
        this.showStatus(false);
        return false
    }
}

exports.Stirrer = Stirrer;