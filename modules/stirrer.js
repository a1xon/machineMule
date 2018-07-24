const delay = require('delay');

class Stirrer {
    constructor (GPIO) {
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