import Exception from "./Exception";

export default class CanvasContextException extends Exception {
    /**
     * Constructor
     */
    constructor(message: string) {
        super(message);
    }
}