// dependencies

import { dateTime } from './utils.js'
import util from 'util';


// system

class StatusConsole {
    constructor(callerFile) {
        this.launchTime = Date.now();
        this.callerFile = callerFile;
    }

    _getTimeSinceLaunch() {
        return (Date.now() - this.launchTime) / 1000;
    }

    _stringify(input) {
      if (typeof input === 'string') {
        return input;
      } else {
        return util.inspect(input, { showHidden: false, depth: null, colors: true });
      }
    }

    _formatMessages(messages) {
        let formattedMessage = "";
        for (const str of messages) {
          formattedMessage += this._stringify(str) + " ";
        }

        let timeStatus = this._getTimeSinceLaunch();
        if (timeStatus > 60) {
          timeStatus = dateTime(4);
        } else timeStatus = `${timeStatus.toFixed(1)}s`;
        return `<${timeStatus} | ${this.callerFile}> ${formattedMessage}`;
    }

    log(...messages) {
        console.log(this._formatMessages(messages));
    }

    warn(...messages) {
        console.warn(this._formatMessages(messages));
    }

    error(...messages) {
        console.error(this._formatMessages(messages));
    }
}


// exports

export { StatusConsole }
