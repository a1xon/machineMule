const delay = require('delay');
const {Component} = require('./component.js');

class Cucumberslicer extends Component {
    constructor (statusLEDS = [], strip, GPIO) {
        super(statusLEDS, strip);
        this.GPIO = GPIO;
    }

    async duty(drink) {

        if (drink !== undefined && drink.Cucumber >= 1) {
            this.showStatus(true);
            await delay(2500);
            return 'cucumber sliced'
        }
        this.showStatus(false);
        return false
    }
}

exports.Cucumberslicer = Cucumberslicer;