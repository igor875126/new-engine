import Core from "../Core/Core";
import IOC from "../Core/IOC";

export default class WindowListeners {

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
        this.registerWindowResizeListener();
        this.registerWindowFocusGainListener();
        this.registerWindowFocusLooseListener();
        this.disableCanvasContextMenu();
        this.initializeCanvasResizing();
    }

    /**
     * Register resize listener
     */
    private registerWindowResizeListener(): void {
        // Register resize event
        window.addEventListener('resize', (event) => {
            // Call resize canvas method
            this.resizeCanvas();

            // Call onWindowResized method of all gameObjects
            for (const gameObject of this.core.gameObjectsManager.getAll()) {
                gameObject.onWindowResized();
            }
        }, false);
    }

    /**
     * Register window focus gain listener
     */
    private registerWindowFocusGainListener(): void {
        // Register window focus gain event
        window.addEventListener('focus', (event) => {
            // Call onWindowFocusGain method of all gameObjects
            for (const gameObject of this.core.gameObjectsManager.getAll()) {
                gameObject.onWindowFocusGain();
            }
        });
    }

    /**
     * Register window focus loose listener
     */
    private registerWindowFocusLooseListener(): void {
        // Register window focus loose event
        window.addEventListener('blur', (event) => {
            // Call onWindowFocusLoose method of all gameObjects
            for (const gameObject of this.core.gameObjectsManager.getAll()) {
                gameObject.onWindowFocusLoose();
            }
        });
    }

    /**
     * Disable canvas context menu
     */
    private disableCanvasContextMenu(): void {
        this.core.canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); };
    }

    /**
     * Initialize canvas resizing, this is needed to initially resize canvas and call resizeCanvas method
     */
    private initializeCanvasResizing(): void {
        // The canvas width and height to the reference resolution
        this.core.canvas.width = this.core.options.rendererOptions.resolution.x;
        this.core.canvas.height = this.core.options.rendererOptions.resolution.y;

        // Call resize canvas method, do not wait until "resize" event happens
        this.resizeCanvas();
    }

    /**
     * Resize canvas
     */
    private resizeCanvas(): void {
        const windowRatio = window.innerWidth / window.innerHeight;
        const baseRatio = this.core.options.rendererOptions.resolution.x / this.core.options.rendererOptions.resolution.y;
        let scale = 0;

        if (windowRatio < baseRatio) {
            // Letterboxing
            scale = window.innerWidth / this.core.options.rendererOptions.resolution.x;
        } else {
            // Pillarboxing
            scale = window.innerHeight / this.core.options.rendererOptions.resolution.y;
        }

        this.core.canvas.style.transform = `scale(${scale}) translate(-50%, -50%)`;
    }
}