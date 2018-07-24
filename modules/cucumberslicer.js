const delay = require('delay');

class Cucumberslicer {
    constructor (GPIO) {
        this.GPIO = GPIO;
    }

    async duty(drink) {
        if (drink !== undefined && drink.Cucumber >= 1) {
            await delay(2500);
            return 'cucumber sliced'
        }
        return false
    }
}

exports.Cucumberslicer = Cucumberslicer;