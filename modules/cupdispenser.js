const delay = require('delay');

class Cupdispenser {
    constructor (GPIO) {
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