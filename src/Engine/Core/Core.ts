import CanvasContextException from "../../Exceptions/CanvasContextException";
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
import Listeners from "./Listeners";
import Renderer from "./Renderer";
import ResourceLoader from "./ResourceLoader";
import { ScalingManager } from "./ScalingManager";

export default class Core {

    public canvas: HTMLCanvasElement;
    public scalingManager: ScalingManager;
    public renderer: Renderer;
    public gameObjectsManager: GameObjectsManager;
    public sceneManager: SceneManager;
    public input: Input;
    public resourceLoader: ResourceLoader;
    public soundManager: SoundManager;
    public eventManager: EventManager;
    public audioContext: AudioContext;
    public locale: Locale;
    public camera: Camera;
    public options: CoreOptionsType;

    private listeners: Listeners;
    private currentTimestamp: number = 0;
    private gameLoopStarted: boolean = false;

    /**
     * Constructor
     */
    constructor(canvas: HTMLCanvasElement, options: CoreOptionsType) {
        // Set link to canvas in class properties
        this.canvas = canvas;

        // Set core options
        this.options = options;

        // Disable right mouse button context menu
        canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); };

        // Get canvas 2D context
        const canvas2DContext = canvas.getContext('2d');

        // In case canvas context could not be get
        if (!canvas2DContext) {
            throw new CanvasContextException('Canvas 2D context could not be retrieved!');
        }

        // Instantiate all core components
        this.audioContext = new AudioContext();
        this.camera = new Camera();
        this.scalingManager = new ScalingManager(options.resolution);
        this.renderer = new Renderer(canvas, canvas2DContext, this.camera, this.scalingManager, this.options.rendererOptions);
        this.eventManager = new EventManager();
        this.gameObjectsManager = new GameObjectsManager(this.eventManager);
        this.input = new Input();
        this.resourceLoader = new ResourceLoader(this.audioContext);
        this.sceneManager = new SceneManager(this.resourceLoader, this.gameObjectsManager);
        this.soundManager = new SoundManager(this.resourceLoader, this.audioContext);
        this.locale = new Locale(this.resourceLoader, this.options.language);

        // Register input listeners
        this.listeners = new Listeners(this.input, this.canvas, this.renderer, this.gameObjectsManager, this.options.environment, this.camera, this.scalingManager);
        this.listeners.register();

        // Put core components to IOC
        IOC.registerSingleton('Renderer', this.renderer);
        IOC.registerSingleton('GameObjectsManager', this.gameObjectsManager);
        IOC.registerSingleton('Input', this.input);
        IOC.registerSingleton('ResourceLoader', this.resourceLoader);
        IOC.registerSingleton('SceneManager', this.sceneManager);
        IOC.registerSingleton('SoundManager', this.soundManager);
        IOC.registerSingleton('EventManager', this.eventManager);
        IOC.registerSingleton('Locale', this.locale);
        IOC.registerSingleton('Core', this);
        IOC.registerSingleton('Camera', this.camera);

        // Set time
        Time.deltaTime = this.currentTimestamp;
        Time.timestamp = this.currentTimestamp;

        // Display fps counter at start when enabled
        if (this.options.debug.toggleFpsRenderingAtStart) {
            this.renderer.toggleDebugFpsRendering();
        }

        // Display colliders at start when enabled
        if (this.options.debug.toggleDebugColliderRenderingAtStart) {
            this.renderer.toggleDebugColliderRendering();
        }
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
            if (!this.gameLoopStarted) {
                this.gameLoopStarted = true;
                this.gameLoop(0);
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
        this.listeners.callMouseOutEventOnAllNeededGameObjects();

        // Set current timestamp
        this.currentTimestamp = timestamp;

        // Request gameLoop again
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
}