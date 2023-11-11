import ImageType from "../../Types/ImageType";
import IOC from "../Core/IOC";
import ResourceLoader from "../Core/ResourceLoader";

export default class Sprite {

    public imageName: string;
    public imageObject: ImageType;
    public positionInAtlasX: number;
    public positionInAtlasY: number;
    public spriteWidth: number;
    public spriteHeight: number;

    /**
     * Constructor
     */
    constructor(imageName: string, positionInAtlasX: number, positionInAtlasY: number, spriteWidth: number, spriteHeight: number) {
        // Get resource loader
        const resourceLoader = IOC.makeSingleton('ResourceLoader') as ResourceLoader;

        // Fill sprite properties
        this.imageName = imageName;
        this.imageObject = resourceLoader.getImageByName(imageName).object;
        this.positionInAtlasX = positionInAtlasX;
        this.positionInAtlasY = positionInAtlasY;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
    }
}