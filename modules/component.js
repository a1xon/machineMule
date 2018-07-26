class Component {
    constructor(statusLEDS = [], strip = {}) {
        this.statusLEDS = statusLEDS;
        this.strip = strip
    }

    async showStatus(busy) {
        if (this.statusLEDS.length > 0) {
            for (let LED of this.statusLEDS) {
                LED.color(busy ? '#FFFFFF' : '#0000FF')
            }
            this.strip.show();
        }
    }
}

exports.Component = Component;