import GameObjectsManager from "./GameObjectsManager";
import IOC from "./IOC";

export default abstract class Scene {

    public images: string[] = [];
    public fonts: string[] = [];
    public sounds: string[] = [];
    public locales: string[] = [];
    public gameObjectsManager: GameObjectsManager;

    /**
     * Constructor
     */
    constructor(images: string[] = [], fonts: string[] = [], sounds: string[] = [], locales: string[] = []) {
        this.images = images;
        this.fonts = fonts;
        this.sounds = sounds;
        this.locales = locales;
        this.gameObjectsManager = IOC.makeSingleton('GameObjectsManager');
    }

    /**
     * This method is called when the scene is loading
     */
    public abstract load(): void;
}