import Core from "../Core/Core";
import IOC from "../Core/IOC";

export default abstract class Scene {

    public images: string[] = [];
    public fonts: string[] = [];
    public sounds: string[] = [];
    public locales: string[] = [];
    public core: Core;

    /**
     * Constructor
     */
    constructor(images: string[] = [], fonts: string[] = [], sounds: string[] = [], locales: string[] = []) {
        this.images = images;
        this.fonts = fonts;
        this.sounds = sounds;
        this.locales = locales;
        this.core = IOC.makeSingleton('Core');
    }

    /**
     * This method is called when the scene is loading
     */
    public abstract load(): void;
}