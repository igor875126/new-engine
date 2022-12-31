import GameObjectsManager from "./GameObjectsManager";
import ResourceLoader from "./ResourceLoader";
import Scene from "./Scene";

/*
Attention important notice for iOS:
Edit (November 2015): iOS 9 no longer allows audio to start in a touchstart event, which breaks the solution below. However it works in a touchend event.
The original answer for iOS 6 is left intact below, but for iOS 9 support make sure you use touchend. Well, sorry to answer my own bounty question, but after hours
of debugging I finally found the answer. Safari on iOS 6 effectively starts with the Web Audio API muted. It will not unmute until you attempt to play a sound in
a user input event (create a buffer source, connect it to destination, and call noteOn()). After this, it unmutes and audio plays unrestricted and as it ought to.
This is an undocumented aspect of how the Web Audio API works on iOS 6 (Apple's doc is here, hopefully they update it with a mention of this soon!)
The user can be touching the screen a lot, engaged in the game. But it will remain muted. You have to play inside a user input event like touchstart
[edit: touchend for iOS 9+], once, then all audio unmutes. After that you can play audio at any time (doesn't have to be in a user input event).
*/
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