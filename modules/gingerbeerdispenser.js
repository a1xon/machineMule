const delay = require('delay');

class Gingerbeerdispenser {
    constructor (GPIO) {
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