export default class Time {

    private static _deltaTime: number;
    private static _timestamp: number;

    /**
     * Get delta time
     */
    public static get deltaTime() {
        return this._deltaTime;
    }

    /**
     * Set delta time
     */
    public static set deltaTime(deltaTime: number) {
        this._deltaTime = Number(deltaTime.toFixed(4));
    }

    /**
     * Get timestamp
     */
    public static get timestamp() {
        return this._timestamp;
    }

    /**
     * Set timestamp
     */
    public static set timestamp(timestamp: number) {
        this._timestamp = timestamp;
    }
}
