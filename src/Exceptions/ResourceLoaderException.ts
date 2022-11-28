import Exception from "./Exception";

export default class ResourceLoaderException extends Exception {
    /**
     * Constructor
     */
    constructor(message: string) {
        super(message);
    }
}