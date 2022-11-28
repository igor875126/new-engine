import { inspect } from 'util';

export default class Logger {

    public static PREFIX = 'NEW-ENGINE';

    /**
     * Debug
     */
    public static debug(message: string, param: any = null): void {
        const style = 'color: cyan;';
        console.log(`%c${Logger.PREFIX} - Debug: ${message}`, style);
        if (param) {
            console.log(`%c ↳ ` + inspect(param, { depth: null, maxArrayLength: null, colors: false }), style);
        }
    }

    /**
     * Info
     */
    public static info(message: string, param: any = null): void {
        const style = 'color: green;';
        console.log(`%c${Logger.PREFIX} - Info: ${message}`, style);
        if (param) {
            console.log(`%c ↳ ` + inspect(param, { depth: null, maxArrayLength: null, colors: false }), style);
        }
    }

    /**
     * Warning
     */
    public static warning(message: string, param: any = null): void {
        const style = 'color: yellow;';
        console.log(`%c${Logger.PREFIX} - Warning: ${message}`, style);
        if (param) {
            console.log(`%c ↳ ` + inspect(param, { depth: null, maxArrayLength: null, colors: false }), style);
        }
    }

    /**
     * Error
     */
    public static error(message: string, param: any = null): void {
        const style = 'color: red;';
        console.log(`%c${Logger.PREFIX} - Error: ${message}`, style);
        if (param) {
            console.log(`%c ↳ ` + inspect(param, { depth: null, maxArrayLength: null, colors: false }), style);
        }
    }
}