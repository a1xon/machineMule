const delay = require('delay');

class Table {
    constructor (GPIO) {
        this.GPIO = GPIO;
    }

    async spin(rotations = 1) {
        await delay(rotations* 2000);
        return true;
    }
}

exports.Table = Table;