"use strict";
const util = require('util');
const singleLog = require('single-line-log').stdout;



const ANIMATION_DELAY = 100;


/**
 * Console long operation mode
 */
const LopConsole = (function () {
    /**
     *
     */
    function LopConsole() {
        this._status = 'Please wait...';
        this.states = ['-', '\\', '/'];
        this.stateLength = this.states.length;
        this.idx = 0; // state index

        //
        // let console_log_original = console.log;
        // console.log = lop_console_log;
    }

    /**
     *
     */
    LopConsole.prototype.log = function () {
        this.clear();   //remove active line
        console.log.apply(console, arguments); // push data
        // this._print(); // resume progress
    };

    /**
     * Start Long Opration
     */
    LopConsole.prototype.startLOP = function (args) {
        var _this = this;
        // console.log.apply(console, arguments);
        this.startTime = Date.now();
        this.endTime = null;
        this._animationTimer = setInterval(function () {
            this.idx = (this.idx + 1) % this.stateLength;
            this._print();
            // this._animationTimer.unref();
        }.bind(this), ANIMATION_DELAY);
    };
    /**
     * Stop Long OPeration
     */
    LopConsole.prototype.stopLOP = function () {
        clearInterval(this._animationTimer);
        this.endTime = Date.now();

        this.clear();
    };
    /**
     * Get elapsed milliseconds
     * @return {number}
     */
    LopConsole.prototype.elapsedLOP = function () {
        return (this.endTime || Date.now()) - this.startTime;
    };
    /**
     * Update long operation progress
     */
    LopConsole.prototype.logLOP = function () {
        this._status = util.format.apply(util, arguments);
    };

    LopConsole.prototype._print = function () {
        singleLog(util.format('[%s] %s', this.states[this.idx], this._status)); // write text
    };


    LopConsole.prototype.clear = function () {
        singleLog('');
        // singleLog.clear(); // not work
    };


    return LopConsole;
}());
module.exports = LopConsole;
