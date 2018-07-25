const delay = require('delay');
const {Component} = require('./component.js');

class Cucumberslicer extends Component {
    constructor (statusLEDS = [], GPIO) {
        super(statusLEDS);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        this.showStatus(true);
        if (drink !== undefined && drink.Cucumber >= 1) {
            await delay(2500);
            return 'cucumber sliced'
        }
        this.showStatus(false);
        return false
    }
}

exports.Cucumberslicer = Cucumberslicer;