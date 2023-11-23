import Core from "../Core/Core";
import IOC from "../Core/IOC";
import Vector2 from "../Utilities/Vector2";

export default class TouchListeners {

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
        this.registerTouchStartListener();
        this.registerTouchMoveListener();
        this.registerTouchEndListener();
        this.registerTouchCancelListener();
    }

    /**
     * Register touch start listener
     */
    private registerTouchStartListener(): void {
        this.core.canvas.addEventListener('touchstart', (event) => {
            // Update input touch object
            this.updateInputTouchObject(event);

            // Prevent default event
            event.preventDefault();
        });
    }

    /**
     * Register touch move listener
     */
    private registerTouchMoveListener(): void {
        this.core.canvas.addEventListener('touchmove', (event) => {
            // Update input touch object
            this.updateInputTouchObject(event);

            // Prevent default event
            event.preventDefault();
        });
    }

    /**
     * Register touch end listener
     */
    private registerTouchEndListener(): void {
        this.core.canvas.addEventListener('touchend', (event) => {
            // Update input touch object
            this.updateInputTouchObject(event);

            // Iterate through all gameObjects
            for (const gameObject of this.core.gameObjectsManager.getAll()) {
                // Get cursor collision point, use the last touch position
                const collisionPoint = this.core.collisionChecker.pointInsideGameObject(this.core.input.touch.touchPositions[this.core.input.touch.fingersDetected], gameObject);

                // In case mouse cursor collided with game object collider
                if (collisionPoint) {
                    // Call on mouse click on the game object
                    gameObject.onMouseClick(collisionPoint);
                }
            }

            // Prevent default event
            event.preventDefault();
        });
    }

    /**
     * Register touch cancel listener
     */
    private registerTouchCancelListener(): void {
        this.core.canvas.addEventListener('touchcancel', (event) => {
            // Set fingersDetected to zero
            this.core.input.touch.fingersDetected = 0;

            // Set all touch positions to zero vector
            this.core.input.touch.touchPositions.fill(new Vector2(0, 0));

            // Set state of screenIsTouched to false
            this.core.input.touch.screenIsTouched = false;

            // Prevent default event
            event.preventDefault();
        });
    }

    /**
     * Update input touch object
     */
    private updateInputTouchObject(event: TouchEvent): void {
        // Update amount of fingers detected
        this.core.input.touch.fingersDetected = event.touches.length;

        // Update screenIsTouched flag
        if (event.touches.length === 0) {
            this.core.input.touch.screenIsTouched = false;
        } else {
            this.core.input.touch.screenIsTouched = true;
        }

        // Get relative coordinates
        const rect = this.core.canvas.getBoundingClientRect();
        const scaleX = this.core.canvas.width / rect.width;
        const scaleY = this.core.canvas.height / rect.height;

        // Now inject touch positions for every finger which is touching the display
        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            this.core.input.touch.touchPositions[i] = new Vector2(x, y);
        }
    }
}