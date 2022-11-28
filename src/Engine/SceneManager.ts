import GameObjectsManager from "./GameObjectsManager";
import ResourceLoader from "./ResourceLoader";
import Scene from "./Scene";

export default class SceneManager {

    private scenes: { [key: string]: Scene } = {};
    private resourceLoader: ResourceLoader;
    private gameObjectsManager: GameObjectsManager;

    /**
     * Constructor
     */
    constructor(resourceLoader: ResourceLoader, gameObjectsManager: GameObjectsManager) {
        this.resourceLoader = resourceLoader;
        this.gameObjectsManager = gameObjectsManager;
    }

    /**
     * Adds new scene to the SceneManager
     */
    public add(sceneName: string, scene: Scene): void {
        this.scenes[sceneName] = scene;
    }

    /**
     * Call method load of scene with name sceneName
     */
    public async load(sceneName: string): Promise<void> {
        // Get the scene by name
        const scene = this.scenes[sceneName];

        // Add all scene images to resource loader queue
        for (const sceneImage of scene.images) {
            this.resourceLoader.addImageToQueue(sceneImage);
        }

        // Add all scene fonts to resource loader queue
        for (const sceneFont of scene.fonts) {
            this.resourceLoader.addFontToQueue(sceneFont);
        }

        // Add all scene sounds to resource loader queue
        for (const sceneSound of scene.sounds) {
            this.resourceLoader.addSoundToQueue(sceneSound);
        }

        // Add all scene locales to resource loader queue
        for (const sceneLocale of scene.locales) {
            this.resourceLoader.addLocaleToQueue(sceneLocale);
        }

        // Load all resources
        await this.resourceLoader.loadAllResources();

        // Destroy all gameObjects
        this.gameObjectsManager.destroyAll();

        // Load the scene
        scene.load();
    }
}