class Component {
    constructor(statusLEDS = [], stripe = {}) {
        this.statusLEDS = statusLEDS;
        this.stripe = stripe
    }

    async showStatus(busy) {
        if (this.statusLEDS.length > 0) {
            for (let LED of this.statusLEDS) {
                LED.color(busy ? '#FFFFFF' : '#0000FF')
            }
            this.stripe.show();
        }
    }
}

exports.Component = Component;