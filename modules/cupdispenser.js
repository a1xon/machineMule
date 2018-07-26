const delay = require('delay');
const {Component} = require('./component.js');

class Cupdispenser extends Component {
    constructor (statusLEDS, strip, GPIO) {
        super(statusLEDS, strip);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && drink.Cup >= 1) {
            this.showStatus(true);
            await delay(2000);
            return 'cup placed';
        }
        this.showStatus(false);
        return false
    }
}

exports.Cupdispenser = Cupdispenser;