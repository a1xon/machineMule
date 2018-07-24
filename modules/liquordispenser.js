const delay = require('delay');

class Liquordispenser {
    constructor (GPIO) {
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && (drink.Vodka >= 1 || drink.Gin >= 1)) {
            await delay(2500);
            return `liquor dispensed ${(drink.Vodka | 0 + drink.Gin | 0)} ml`
        }
        return false
    }
}

exports.Liquordispenser = Liquordispenser;