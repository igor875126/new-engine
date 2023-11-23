import CollisionChecker from "../Utilities/CollisionChecker";
import Helper from "../../Helpers/Helper";
import CoreOptionsType from "../../Types/CoreOptionsType";
import EventManager from "../Managers/EventManager";
import GameObjectsManager from "../Managers/GameObjectsManager";
import SceneManager from "../Managers/SceneManager";
import SoundManager from "../Managers/SoundManager";
import Camera from "../Utilities/Camera";
import Input from "../Utilities/Input";
import Locale from "../Utilities/Locale";
import Scene from "../Utilities/Scene";
import Time from "../Utilities/Time";
import IOC from "./IOC";
import Renderer from "./Renderer";
import ResourceLoader from "./ResourceLoader";
import DebugListeners from "../Listeners/DebugListeners";
import KeyboardListeners from "../Listeners/KeyboardListeners";
import MouseListeners from "../Listeners/MouseListeners";
import TouchListeners from "../Listeners/TouchListeners";
import WindowListeners from "../Listeners/WindowListeners";

export default class Core {

    public canvas: HTMLCanvasElement;
    public renderer: Renderer;
    public gameObjectsManager: GameObjectsManager;
    public sceneManager: SceneManager;
    public input: Input;
    public resourceLoader: ResourceLoader;
    public soundManager: SoundManager;
    public eventManager: EventManager;
    public audioContext: AudioContext;
    public locale: Locale;
    public collisionChecker: CollisionChecker;
    public camera: Camera;
    public debugListeners: DebugListeners;
    public keyboardListeners: KeyboardListeners;
    public mouseListeners: MouseListeners;
    public touchListeners: TouchListeners;
    public windowListeners: WindowListeners;
    public options: CoreOptionsType;

    private currentTimestamp: number = 0;
    private gameLoopStarted: boolean = false;
    private fixedLoopStarted: boolean = false;

    /**
     * Constructor
     */
    constructor(canvas: HTMLCanvasElement, options: CoreOptionsType) {
        // Put components to IOC
        IOC.registerSingleton('Core', this);

        // Remember arguments
        this.canvas = canvas;
        this.options = options;

        // Instantiate all core components
        this.audioContext = new AudioContext();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.eventManager = new EventManager();
        this.gameObjectsManager = new GameObjectsManager();
        this.input = new Input();
        this.resourceLoader = new ResourceLoader();
        this.sceneManager = new SceneManager();
        this.soundManager = new SoundManager();
        this.locale = new Locale();
        this.collisionChecker = new CollisionChecker();

        // Register event listeners
        this.debugListeners = new DebugListeners();
        this.debugListeners.registerListeners();
        this.keyboardListeners = new KeyboardListeners();
        this.keyboardListeners.registerListeners();
        this.mouseListeners = new MouseListeners();
        this.mouseListeners.registerListeners();
        this.touchListeners = new TouchListeners();
        this.touchListeners.registerListeners();
        this.windowListeners = new WindowListeners();
        this.windowListeners.registerListeners();

        // Set time
        Time.deltaTime = this.currentTimestamp;
        Time.timestamp = this.currentTimestamp;
    }

    /**
     * Adds new scene to the SceneManager
     */
    public addScene(sceneName: string, scene: Scene): void {
        this.sceneManager.add(sceneName, scene);
    }

    /**
     * Load a scene and run the game
     */
    public loadSceneAndRun(sceneName: string): void {
        this.sceneManager.load(sceneName).then(() => {
            // Start game loop
            if (!this.gameLoopStarted) {
                this.gameLoopStarted = true;
                this.gameLoop(0);
            }

            // Start fixed loop
            if (!this.fixedLoopStarted) {
                this.fixedLoopStarted = true;
                this.fixedLoop();
            }
        });
    }

    /**
     * This method is called every frame
     */
    private gameLoop(timestamp: number): void {
        // Get deltaTime and set it to Time object
        Time.deltaTime = (timestamp - this.currentTimestamp) / 1000;

        // Get timestamp and set it to Time object
        Time.timestamp = timestamp;

        // Call start method of all instantiated game objects
        this.gameObjectsManager.callStartMethodOfInstantiatedGameObjects();

        // Draw game objects
        for (const gameObject of this.gameObjectsManager.getAll()) {
            this.renderer.addToDrawingQueue(gameObject);
        }

        // Call update function of all gameObjects
        for (const gameObject of this.gameObjectsManager.getAll()) {
            // Do not call gameObject update method when window is hidden
            // TODO, does not work as expected
            if (document.hidden) {
                continue;
            }

            // Call update
            gameObject.update();
        }

        // Render on the screen
        this.renderer.flush();

        // TODO DO WE NEED THIS??? I don't think so
        // Reset mouse button state and keyboard state
        // this.input.mouseButtonsStates = {};
        // this.input.keyboardButtonsStates = {};

        // Call mouse out event on all needed game objects in the end of the frame
        this.mouseListeners.callMouseOutEventOnAllNotHoveredGameObjects();

        // Set current timestamp
        this.currentTimestamp = timestamp;

        // Request gameLoop again
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Used to check collisions between gameObjects
     */
    private async fixedLoop(): Promise<void> {
        // Check if collision check is enabled
        if (!this.options.collisions.enabled) {
            // Nope
            return;
        }

        // First of all get all gameObjects
        const allGameObjects = this.gameObjectsManager.getAll();

        // Now throw out gameObjects where collider is set to null
        const gameObjectsWithCollider = allGameObjects.filter((gameObject) => gameObject.collider);

        // Check collision
        for (const gameObject1 of gameObjectsWithCollider) {
            for (const gameObject2 of gameObjectsWithCollider) {
                // Check collision
                const collision = this.collisionChecker.checkCollisionBetweenGameObjects(gameObject1, gameObject2);

                // In case collision happened
                if (collision) {
                    gameObject2.onCollision(collision);
                }
            }
        }

        // Wait until next call
        await Helper.sleep(this.options.collisions.fixedLoopWaitInMs);

        // Run method again
        this.fixedLoop();
    }
}