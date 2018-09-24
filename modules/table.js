const delay = require('delay');
const { WiringSettings } = require('../settings')
const obstructed = 'open';
const free = 'close';

class Table {
    constructor (five) {
        this.stepper = new five.Stepper({});
        this.endStop = new five.Switch();
        this.numberOfSpins = 0;

        this.endStop.on(obstructed, function() {
            // if statement for first spin;
            if (this.numberOfSpins > 0) {
                this.stepper.stop();
            }
        });
        this.endStop.on(free, function() {
            this.numberOfSpins++;
        });

        //spin for correct position
        stepper.rpm(180).ccw().accel(1600).step(2000, function() {
            return true;
        });
    };


    spin(rotations = 1) {
        return new Promise(function(resolve, reject){
        stepper.rpm(180).ccw().accel(1600).step(2000, function() {
            resolve(true);
        });
    });
    }
}

exports.Table = Table;