import KeyboardButtonsEnum from "../../Enums/KeyboardButtonsEnum";
import Core from "../Core/Core";
import IOC from "../Core/IOC";

export default class DebugListeners {

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
        this.registerDebugListeners();
        this.showDebugThingsAtStartIfNeeded();
    }

    /**
     * Register debug listeners
     */
    private registerDebugListeners(): void {
        // Register debug key down events
        window.addEventListener('keydown', (event) => {
            // Do not allow debug in production
            if (this.core.options.environment === 'production') {
                return;
            }

            // Enable/Disable FPS rendering
            if (event.keyCode === KeyboardButtonsEnum.Digit1) {
                this.core.renderer.toggleDebugFpsRendering();
            }

            // Enable/Disable Collider rendering
            if (event.keyCode === KeyboardButtonsEnum.Digit2) {
                this.core.renderer.toggleDebugColliderRendering();
            }
        });
    }

    /**
     * Show debug things at start if needed
     */
    private showDebugThingsAtStartIfNeeded(): void {
        // Display fps counter at start when enabled
        if (this.core.options.debug.toggleFpsRenderingAtStart) {
            this.core.renderer.toggleDebugFpsRendering();
        }

        // Display colliders at start when enabled
        if (this.core.options.debug.toggleDebugColliderRenderingAtStart) {
            this.core.renderer.toggleDebugColliderRendering();
        }
    }
}