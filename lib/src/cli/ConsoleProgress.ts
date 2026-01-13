import { stdout } from 'single-line-log';
import * as util from 'util';


const ANIMATION_DELAY = 100;

const STATE_ANIMATION = '|/-\\';

/**
 * Console long operation mode
 */
export class ConsoleProgress {

    private _status = 'Please wait...';

    private _stateIdx = 0;
    private _stateLength = STATE_ANIMATION.length;

    private _animationTimer;


    /**
     *
     */
    log(...args) {
        this.clear();   //remove active line
        console.log.apply(console, args); // push data
        // this._print(); // resume progress
    }

    /**
     * Start Long Operation
     */
    startLOP() {
        this._animationTimer = setInterval(() => {
            this._stateIdx = (this._stateIdx + 1) % this._stateLength;
            this._print();
            // this._animationTimer.unref();
        }, ANIMATION_DELAY);
    }

    /**
     * Stop Long Operation
     */
    stopLOP() {
        clearInterval(this._animationTimer);
        this.clear();
    }

    /**
     * Update long operation progress
     */
    logLOP(...args) {
        this._status = util.format.apply(util, args);
        this._print();
    }

    _print() {
        stdout(util.format('[%s] %s', STATE_ANIMATION[this._stateIdx], this._status)); // write text
    }

    clear() {
        stdout('');
    }

}
