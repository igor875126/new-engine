/**
 * The Logger class serves as a centralized logging system for an application or game, providing a simple yet
 * flexible way to handle various types of messages such as debug information, informational messages, warnings,
 * and error reports. It offers different methods corresponding to the level of severity of the log message.
 * The Logger enhances the debugging process by formatting output with styles for visual distinction and by
 * supporting structured representation of objects and arrays, which is particularly useful for complex data types
 * commonly found in game development. Its modular design allows for easy expansion and customization of the logging
 * behavior, ensuring that developers have the necessary tools for comprehensive logging throughout the development
 * lifecycle and post-deployment monitoring.
 */

export enum LogLevel {
    Debug,
    Info,
    Warning,
    Error
}

export default class Logger {

    public static PREFIX = 'NEW-ENGINE';

    private static levelStyles = {
        [LogLevel.Debug]: 'color: cyan;',
        [LogLevel.Info]: 'color: lightgreen;',
        [LogLevel.Warning]: 'color: yellow;',
        [LogLevel.Error]: 'color: red;'
    };

    /**
     * Format param
     */
    private static formatParam(param: any): string {
        if (param === null || param === undefined) {
            return String(param);
        } else if (Array.isArray(param) && param.length && param[0].constructor.name === 'GameObject') {
            // Assuming GameObject has a meaningful toString() method
            return param.map((item, index) => `${index}: ${item.toString()}`).join('\n');
        } else if (typeof param === 'object') {
            let cache: any[] = [];
            const result = JSON.stringify(param, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (cache.includes(value)) {
                        // Duplicate reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            }, 2);
            // @ts-ignore
            cache = null; // Enable garbage collection
            return result;
        } else {
            return param.toString();
        }
    }

    /**
     * Log
     */
    private static log(level: LogLevel, message: string, param: any = null): void {
        const style = Logger.levelStyles[level];
        console.log(`%c${Logger.PREFIX} - ${LogLevel[level]}: ${message}\n${Logger.formatParam(param)}`, style);
    }

    /**
     * Debug
     */
    public static debug(message: string, param?: any): void {
        Logger.log(LogLevel.Debug, message, param);
    }

    /**
     * Info
     */
    public static info(message: string, param?: any): void {
        Logger.log(LogLevel.Info, message, param);
    }

    /**
     * Warning
     */
    public static warning(message: string, param?: any): void {
        Logger.log(LogLevel.Warning, message, param);
    }

    /**
     * Error
     */
    public static error(message: string, param?: any): void {
        Logger.log(LogLevel.Error, message, param);
    }
}
