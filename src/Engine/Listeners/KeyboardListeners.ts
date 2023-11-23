import Core from "../Core/Core";
import IOC from "../Core/IOC";

export default class KeyboardListeners {

    private core: Core;

    /**
     * Constructor
     */
    constructor() {
        this.core = IOC.makeSingleton('Core');
    }

    /**
     * Register listeners
     */
    public registerListeners(): void {
        this.registerKeydownListener();
        this.registerKeyupListener();
    }

    /**
     * Register keydown listener
     */
    private registerKeydownListener(): void {
        window.addEventListener('keydown', (event) => {
            this.core.input.keyboard.keyboardButtonsStates[event.keyCode] = true;
        });
    }

    /**
     * Register keyup listener
     */
    private registerKeyupListener(): void {
        window.addEventListener('keyup', (event) => {
            this.core.input.keyboard.keyboardButtonsStates[event.keyCode] = false;
        });
    }
}