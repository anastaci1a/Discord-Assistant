// dependencies

import { dateTime } from './utils.js'
import util from 'util';


// system

class StatusConsole {
  constructor(callerFile) {
    this.launchTime = Date.now();
    this.callerFile = callerFile;
  }

  #getTimeSinceLaunch() {
    return (Date.now() - this.launchTime) / 1000;
  }

  #stringify(input) {
    if (typeof input === 'string') {
      return input;
    } else {
      return util.inspect(input, { showHidden: false, depth: null, colors: true });
    }
  }

  #formatMessages(messages, errorLevel = 0) {
    let callerFileFormatted = `\x1b[36m${this.callerFile}`;

    let formattedMessage = "";
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      formattedMessage += this.#stringify(msg);
      if (i != messages.length - 1) formattedMessage += " ";
    }

    let timeStatus = this.#getTimeSinceLaunch();
    if (timeStatus > 30) {
      timeStatus = `\x1b[33m${dateTime(4)}`; // yellow
    } else timeStatus = `\x1b[32m${timeStatus.toFixed(1)}s`; // green

    return `\x1b[34m<`                  + // blue
           `${timeStatus}`              + // green/yellow (defined in code)
           `\x1b[34m | `                + // blue
           `${callerFileFormatted}`     + // cyan/yellow/red (defined in code)
           `\x1b[34m>`                  + // blue
           `\x1b[0m ${formattedMessage}`; // reset (white)
  }

  #formatError(origin, messages, errorLevel) {
    let callerFileFormatted = "";
    let errorIdentifier = ""

    switch (errorLevel) {
      case 0: // .resolve
        callerFileFormatted = `\x1b[32m${this.callerFile} (${origin})`; // green
        errorIdentifier = "\x1b[32m[RESOLVED]";
        break;
      case 1: // .warn
        callerFileFormatted = `\x1b[33m${this.callerFile} (${origin})`; // yellow
        errorIdentifier = "\x1b[33m[WARN]";
        break;
      case 2: // .error
        callerFileFormatted = `\x1b[31m${this.callerFile} (${origin}) \x1b[33m(not thrown)`; // red/yellow
        errorIdentifier = "\x1b[31m[ERROR]";
        break;
      case 3: // .errorThrow
        callerFileFormatted = `\x1b[31m${this.callerFile} (${origin})`; // red
        errorIdentifier = "\x1b[31m[ERROR]";
        break;
    }

    let formattedMessage = "";
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      formattedMessage += this.#stringify(msg);
      if (i != messages.length - 1) formattedMessage += "\n"
    }

    // add bars at beginning of newlines
    formattedMessage = formattedMessage.replaceAll("\n", "\n\x1b[0m\x1b[0m│   ");     // add ">" at beginning of every line
    formattedMessage = formattedMessage.replaceAll("\x1b[0m│       ", "\x1b[0m│   "); // prevent excess spacing from error throws

    // replace first instance of "│   " with "├   "
    formattedMessage = formattedMessage.replace("│   ", '├   ');

    // replace last instance of "│   " with "└   "
    formattedMessage = formattedMessage.split('').reverse().join('').replace("   │", "   └").split('').reverse().join('');

    let timeStatus = this.#getTimeSinceLaunch();
    if (timeStatus > 30) {
      timeStatus = `\x1b[33m${dateTime(4)}`; // yellow
    } else timeStatus = `\x1b[32m${timeStatus.toFixed(1)}s`; // green

    if (formattedMessage.length > 0) {
      return `\x1b[34m<`                 + // blue
             `${timeStatus}`             + // green/yellow (defined in code)
             `\x1b[34m | `               + // blue
             `${callerFileFormatted}`    + // // green/yellow/red (defined in code)
             `\x1b[34m>`                 + // blue
             `\n${errorIdentifier}: `    + // // green/yellow/red (defined in code)
             `\x1b[0m${formattedMessage}`; // reset (white)
    } else {
      return `\x1b[34m<`              + // blue
             `${timeStatus}`          + // green/yellow (defined in code)
             `\x1b[34m | `            + // blue
             `${callerFileFormatted}` + // green/yellow/red (defined in code)
             ` ${errorIdentifier}`    + // green/yellow/red (defined in code)
             `\x1b[34m>`;               // blue
    }
  }

  #formatNoStatus(messages) {
    let formattedMessage = "";
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      formattedMessage += this.#stringify(msg);
      if (i != messages.length - 1) formattedMessage += " ";
    }

    return formattedMessage;
  }

  logNoStatus(...messages) {
    console.log(this.#formatNoStatus(messages));
  }

  log(...messages) {
    console.log(this.#formatMessages(messages));
  }

  resolve(origin, ...messages) {
    console.log(this.#formatError(origin, messages, 0));
  }

  warn(origin, ...messages) {
    console.warn(this.#formatError(origin, messages, 1));
  }

  error(origin, ...messages) {
    console.error(this.#formatError(origin, messages, 2));
  }

  errorThrow(origin, ...messages) {
    const error = this.#formatError(origin, messages, 3);
    throw new Error(error);
  }
}


// exports

export { StatusConsole }
