import Helper from "../../Helpers/Helper";
import Vector2 from "../Utilities/Vector2";
import GameObject from "../../Entities/Primitives/GameObject";
import Core from "../Core/Core";
import IOC from "../Core/IOC";

export default class MouseListeners {

    private core: Core;
    private mouseOverGameObjects: GameObject[] = [];

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
        // Do not register mouse listeners in case of mobile user
        if (this.isMobileUser()) {
            return;
        }

        // Register listeners
        this.registerMouseClickListener();
        this.registerMousedownListener();
        this.registerMouseupListener();
        this.registerMousemoveToInjectMousePositionListener();
        this.registerMousemoveToCheckOnMouseOverListener();
    }

    /**
     * Register mouse click listener
     */
    private registerMouseClickListener(): void {
        // Add event listener
        this.core.canvas.addEventListener('click', (event) => {
            // Get mouse position
            const mousePosition = this.core.input.getMousePosition();

            // Iterate through all gameObjects
            for (const gameObject of this.core.gameObjectsManager.getAll()) {
                // Get cursor collision point
                const collisionPoint = this.core.collisionChecker.pointInsideGameObject(mousePosition, gameObject);

                // In case mouse cursor collided with game object collider
                if (collisionPoint) {
                    // Call on mouse click on the game object
                    gameObject.onMouseClick(collisionPoint);
                }
            }
        });
    }

    /**
     * Register mousedown listener
     */
    private registerMousedownListener(): void {
        // Add event listener
        this.core.canvas.addEventListener('mousedown', (event) => {
            this.core.input.mouse.mouseButtonsStates[event.button] = true;
        });
    }

    /**
     * Register mousedown listener
     */
    private registerMouseupListener(): void {
        // Add event listener
        this.core.canvas.addEventListener('mouseup', (event) => {
            this.core.input.mouse.mouseButtonsStates[event.button] = false;
        });
    }

    /**
     * Register mousemove to inject mouse position listener
     */
    private registerMousemoveToInjectMousePositionListener(): void {
        // Add event listener
        this.core.canvas.addEventListener('mousemove', (event) => {
            // Get relative coordinates
            const rect = this.core.canvas.getBoundingClientRect();
            const scaleX = this.core.canvas.width / rect.width;
            const scaleY = this.core.canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            // Inject into Input class
            this.core.input.mouse.mousePosition = new Vector2(x, y);
        });
    }

    /**
     * Register mousemove to check on mouse over listener
     */
    private registerMousemoveToCheckOnMouseOverListener(): void {
        // Add event listener
        this.core.canvas.addEventListener('mousemove', (event) => {
            // Get mouse position
            const mousePosition = this.core.input.getMousePosition();

            // Iterate through all gameObjects
            for (const gameObject of this.core.gameObjectsManager.getAll()) {
                // Skip gameObject if it is already hovered
                if (this.checkIfGameObjectAlreadyHovered(gameObject)) {
                    continue;
                }

                // Get cursor collision point
                const collisionPoint = this.core.collisionChecker.pointInsideGameObject(mousePosition, gameObject);

                // In case mouse cursor collided with game object collider
                if (collisionPoint) {
                    // Call on mouse over on the game object
                    gameObject.onMouseOver(collisionPoint);

                    // Add game object to mouse over game objects
                    this.mouseOverGameObjects.push(gameObject);
                }
            }
        });
    }

    /**
     * Call mouse out event on all not hovered game objects
     */
    public callMouseOutEventOnAllNotHoveredGameObjects(): void {
        // Get mouse position
        const mousePosition = this.core.input.getMousePosition();

        // Iterate through all game objects which are or were hovered
        for (const gameObject of this.mouseOverGameObjects) {

            // Get cursor collision point
            const collisionPoint = this.core.collisionChecker.pointInsideGameObject(mousePosition, gameObject);

            // In case mouse cursor collided with game object collider
            if (!collisionPoint) {
                // Call on mouse out on the game object
                gameObject.onMouseOut();

                // Remove game object from already hovered list
                this.removeGameObjectFromAlreadyHoveredList(gameObject);
            }
        }
    }

    /**
     * Check if mobile user
     */
    private isMobileUser(): boolean {
        return Helper.mobileUserAgent();
    }

    /**
     * Check if game object already hovered
     */
    private checkIfGameObjectAlreadyHovered(gameObject: GameObject): boolean {
        for (const el of this.mouseOverGameObjects) {
            if (gameObject.name === el.name) {
                return true;
            }
        }
        return false;
    }

    /**
     * Destroy gameObject (delete)
     */
    private removeGameObjectFromAlreadyHoveredList(gameObject: GameObject): void {
        for (let i = 0; i < this.mouseOverGameObjects.length; i++) {
            if (this.mouseOverGameObjects[i].name === gameObject.name) {
                this.mouseOverGameObjects.splice(i, 1);
            }
        }
    }
}