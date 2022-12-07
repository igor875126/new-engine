import KeyboardButtonsEnum from "../Enums/KeyboardButtonsEnum";
import CollisionChecker from "../Helpers/CollisionChecker";
import Helper from "../Helpers/Helper";
import CircleCollider from "./CircleCollider";
import GameObjectsManager from "./GameObjectsManager";
import Input from "./Input";
import RectCollider from "./RectCollider";
import Renderer from "./Renderer";
import Vector2 from "./Vector2";
import GameObject from "../Objects/GameObject";
import Camera from "./Camera";

export default class Listeners {

    private input: Input;
    private canvas: HTMLCanvasElement;
    private renderer: Renderer;
    private gameObjectsManager: GameObjectsManager;
    private environment: 'development' | 'production';
    private camera: Camera;
    private mouseOverGameObjects: GameObject[] = [];

    /**
     * Constructor
     */
    constructor(input: Input, canvas: HTMLCanvasElement, renderer: Renderer, gameObjectsManager: GameObjectsManager, environment: 'development' | 'production', camera: Camera) {
        this.input = input;
        this.canvas = canvas;
        this.renderer = renderer;
        this.gameObjectsManager = gameObjectsManager;
        this.environment = environment;
        this.camera = camera;
    }

    /**
     * Register all listeners
     */
    public register(): void {
        this.registerMouseListeners();
        this.registerKeyboardListeners();
        this.registerResizeListeners();
        this.registerWindowFocusListeners();
        this.registerDebugListeners();
    }

    /**
     * Call mouse out event on all needed game objects
     */
    public callMouseOutEventOnAllNeededGameObjects(): void {
        // Get mouse position
        const mousePosition = this.input.getMousePosition();

        // Iterate through all game objects which are or were hovered
        for (const gameObject of this.mouseOverGameObjects) {
            // In case gameObjects collider is a circle collider
            if (gameObject.collider instanceof CircleCollider) {
                // Check if mouse cursor is no more above the collider
                if (!CollisionChecker.pointInsideCircle(mousePosition.x, mousePosition.y, gameObject.position.x + gameObject.collider.offset.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y + gameObject.collider.offset.y - this.camera.getPositionOffsetForRenderer(gameObject).y, gameObject.collider.radius)) {
                    gameObject.onMouseOut();
                    this.removeGameObjectFromAlreadyHoveredList(gameObject);
                }
            }

            // In case gameObjects collider is a rect collider
            if (gameObject.collider instanceof RectCollider) {
                // Check if mouse cursor is no more above the collider
                if (!CollisionChecker.pointInsideRectangle(mousePosition.x, mousePosition.y, gameObject.position.x + gameObject.collider.offset.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y + gameObject.collider.offset.y - this.camera.getPositionOffsetForRenderer(gameObject).y, gameObject.collider.size.x, gameObject.collider.size.y)) {
                    gameObject.onMouseOut();
                    this.removeGameObjectFromAlreadyHoveredList(gameObject);
                }
            }
        }
    }

    /**
     * Register mouse listeners
     */
    private registerMouseListeners(): void {
        // Mouse down
        this.canvas.addEventListener('mousedown', (event) => {
            this.input.mouseButtonsStates[event.button] = true;
        });

        // Mouse up
        this.canvas.addEventListener('mouseup', (event) => {
            this.input.mouseButtonsStates[event.button] = false;
        });

        // Mouse move
        this.canvas.addEventListener('mousemove', (event) => {
            // Get relative coordinates
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Inject into Input class
            this.input.mousePosition = new Vector2(x, y);
        });

        // Mouse click event
        this.canvas.addEventListener('click', (event) => {
            // Do not apply on mobile
            if (Helper.mobileUserAgent()) {
                return;
            }

            // Get mouse position
            const mousePosition = this.input.getMousePosition();

            // Call on mouse click method on game objects
            this.callOnMouseClickMethodOnGameObjects(mousePosition.x, mousePosition.y);
        });

        // Mobile mouse click event
        this.canvas.addEventListener('touchend', (event) => {
            // Get relative coordinates
            const rect = this.canvas.getBoundingClientRect();
            const touch = event.touches[0] || event.changedTouches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // Call on mouse click method on game objects
            this.callOnMouseClickMethodOnGameObjects(x, y);
        });

        // Mouse over event
        this.canvas.addEventListener('mousemove', (event) => {
            // Do not apply on mobile
            if (Helper.mobileUserAgent()) {
                return;
            }

            // Get mouse position
            const mousePosition = this.input.getMousePosition();

            // Call onMouseOver method of all gameObjects
            for (const gameObject of this.gameObjectsManager.getAll()) {
                // In case gameObject does not have any collider attached to it
                if (!gameObject.collider) {
                    continue;
                }

                // Skip gameObject if it is already hovered
                if (this.checkIfGameObjectAlreadyHovered(gameObject)) {
                    continue;
                }

                // In case gameObjects collider is a circle collider
                if (gameObject.collider instanceof CircleCollider) {
                    // Check if mouse cursor is above the collider
                    if (CollisionChecker.pointInsideCircle(mousePosition.x, mousePosition.y, gameObject.position.x + gameObject.collider.offset.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y + gameObject.collider.offset.y - this.camera.getPositionOffsetForRenderer(gameObject).y, gameObject.collider.radius)) {
                        gameObject.onMouseOver();
                        this.mouseOverGameObjects.push(gameObject);

                        // Break the loop here, because we don't want to call onMouseOver of all layered objects, only the most top one
                        break;
                    }
                }

                // In case gameObjects collider is a rect collider
                if (gameObject.collider instanceof RectCollider) {
                    // Check if mouse cursor is above the collider
                    if (CollisionChecker.pointInsideRectangle(mousePosition.x, mousePosition.y, gameObject.position.x + gameObject.collider.offset.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y + gameObject.collider.offset.y - this.camera.getPositionOffsetForRenderer(gameObject).y, gameObject.collider.size.x, gameObject.collider.size.y)) {
                        gameObject.onMouseOver();
                        this.mouseOverGameObjects.push(gameObject);

                        // Break the loop here, because we don't want to call onMouseOver of all layered objects, only the most top one
                        break;
                    }
                }
            }
        });
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

    /**
     * Call on mouse click method on game objects
     */
    private callOnMouseClickMethodOnGameObjects(x: number, y: number): void {
        // Call onMouseClick method of all gameObjects
        for (const gameObject of this.gameObjectsManager.getAll()) {
            // In case gameObject does not have any collider attached to it
            if (!gameObject.collider) {
                continue;
            }

            // In case gameObjects collider is a circle collider
            if (gameObject.collider instanceof CircleCollider) {
                // Check if mouse cursor is above the collider
                if (CollisionChecker.pointInsideCircle(x, y, gameObject.position.x + gameObject.collider.offset.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y + gameObject.collider.offset.y - this.camera.getPositionOffsetForRenderer(gameObject).y, gameObject.collider.radius)) {
                    gameObject.onMouseClick();

                    // Break the loop here, because we don't want to call onMouseClick of all layered objects, only the most top one
                    break;
                }
            }

            // In case gameObjects collider is a rect collider
            if (gameObject.collider instanceof RectCollider) {
                // Check if mouse cursor is above the collider
                if (CollisionChecker.pointInsideRectangle(x, y, gameObject.position.x + gameObject.collider.offset.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y + gameObject.collider.offset.y - this.camera.getPositionOffsetForRenderer(gameObject).y, gameObject.collider.size.x, gameObject.collider.size.y)) {
                    gameObject.onMouseClick();

                    // Break the loop here, because we don't want to call onMouseClick of all layered objects, only the most top one
                    break;
                }
            }
        }
    }

    /**
     * Register keyboard listeners
     */
    private registerKeyboardListeners(): void {
        // Keyboard down
        window.addEventListener('keydown', (event) => {
            this.input.keyboardButtonsStates[event.keyCode] = true;
        });

        // Keyboard up
        window.addEventListener('keyup', (event) => {
            this.input.keyboardButtonsStates[event.keyCode] = false;
        });
    }

    /**
     * Register resize listener
     */
    private registerResizeListeners(): void {
        // Register resize event
        window.addEventListener('resize', (event) => {
            // Call method in renderer
            this.renderer.resizeCanvas();

            // Call onWindowResized method of all gameObjects
            for (const gameObject of this.gameObjectsManager.getAll()) {
                gameObject.onWindowResized();
            }
        }, false);
    }

    /**
     * Register window focus listeners
     */
    private registerWindowFocusListeners(): void {
        // Register window focus gain event
        window.addEventListener('focus', (event) => {
            // Call onWindowFocusGain method of all gameObjects
            for (const gameObject of this.gameObjectsManager.getAll()) {
                gameObject.onWindowFocusGain();
            }
        });

        // Register window focus loose event
        window.addEventListener('blur', (event) => {
            // Call onWindowFocusLoose method of all gameObjects
            for (const gameObject of this.gameObjectsManager.getAll()) {
                gameObject.onWindowFocusLoose();
            }
        });
    }

    /**
     * Register debug listeners
     */
    private registerDebugListeners(): void {
        // Register debug key down events
        window.addEventListener('keydown', (event) => {
            // Do not allow debug in production
            if (this.environment === 'production') {
                return;
            }

            // Enable/Disable FPS rendering
            if (event.keyCode === KeyboardButtonsEnum.Digit1) {
                this.renderer.debug.fpsRenderingEnabled = !this.renderer.debug.fpsRenderingEnabled;
            }

            // Enable/Disable Collider rendering
            if (event.keyCode === KeyboardButtonsEnum.Digit2) {
                this.renderer.debug.colliderRenderingEnabled = !this.renderer.debug.colliderRenderingEnabled;
            }
        });
    }
}