const delay = require('delay');
const {Component} = require('./component.js');

console.log(Component);

class Cupdispenser extends Component {
    constructor (statusLEDS, GPIO) {
        super(statusLEDS);
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && drink.Cup >= 1) {
            await delay(2000);
            return 'cup placed';
        }
        return false
    }
}

exports.Cupdispenser = Cupdispenser;