import ImageType from "../../Types/ImageType";
import Core from "../Core/Core";
import IOC from "../Core/IOC";

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
        // Get core
        const core = IOC.makeSingleton('Core') as Core;

        // Fill sprite properties
        this.imageName = imageName;
        this.imageObject = core.resourceLoader.getImageByName(imageName).object;
        this.positionInAtlasX = positionInAtlasX;
        this.positionInAtlasY = positionInAtlasY;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
    }
}