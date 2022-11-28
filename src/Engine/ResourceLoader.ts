import ResourceLoaderException from "../Exceptions/ResourceLoaderException";
import FontType from "../Types/FontType";
import ImageType from "../Types/ImageType";
import LocaleType from "../Types/LocaleType";
import SoundType from "../Types/SoundType";

export default class ResourceLoader {

    private images: ImageType[] = [];
    private fonts: FontType[] = [];
    private sounds: SoundType[] = [];
    private locales: LocaleType[] = [];
    private audioContext: AudioContext;

    /**
     * Constructor
     */
    constructor(audioContext: AudioContext) {
        this.audioContext = audioContext;
    }

    /**
     * Add image to loading queue
     */
    public addImageToQueue(url: string): void {
        // Add to queue
        this.images.push({
            name: url.split('/').pop()!.split('.').shift()!,
            url,
            object: null,
            loaded: false,
        });
    }

    /**
     * Add font to queue
     */
    public addFontToQueue(url: string): void {
        // Add to queue
        this.fonts.push({
            name: url.split('/').pop()!.split('.').shift()!,
            url,
            loaded: false,
        });
    }


    /**
     * Add sound to loading queue
     */
    public addSoundToQueue(url: string): void {
        // Add to queue
        this.sounds.push({
            name: url.split('/').pop()!.split('.').shift()!,
            url,
            loaded: false,
            object: null,
        });
    }

    /**
     * Add locale to loading queue
     */
    public addLocaleToQueue(url: string): void {
        // Add to queue
        this.locales.push({
            name: url.split('/').pop()!.split('.').shift()!,
            url,
            loaded: false,
        });
    }

    /**
     * Get image by name
     */
    public getImageByName(name: string): ImageType {
        // Search for image by name
        for (const image of this.images) {
            // In case resource is not loaded
            if (!image.loaded) {
                throw new ResourceLoaderException(`Ups cannot get image by name, since it's not loaded!`);
            }

            // In case we've found by name
            if (image.name === name) {
                return image;
            }
        }

        // If not found, throw exception
        throw new ResourceLoaderException(`Requested image with name ${name} not found in the scene! Maybe your scene should load it?`);
    }

    /**
     * Get sound by name
     */
    public getSoundByName(name: string): SoundType {
        // Search for sound by name
        for (const sound of this.sounds) {
            // In case resource is not loaded
            if (!sound.loaded) {
                throw new ResourceLoaderException(`Ups cannot get sound by name, since it's not loaded!`);
            }

            // In case we've found by name
            if (sound.name === name) {
                return sound;
            }
        }

        // If not found, throw exception
        throw new ResourceLoaderException(`Requested sound with name ${name} not found in the scene! Maybe your scene should load it?`);
    }

    /**
     * Get locale by name
     */
    public getLocaleByName(name: string): LocaleType {
        // Search for locale by name
        for (const locale of this.locales) {
            // In case resource is not loaded
            if (!locale.loaded) {
                throw new ResourceLoaderException(`Ups cannot get locale by name, since it's not loaded!`);
            }

            // In case we've found by name
            if (locale.name === name) {
                return locale;
            }
        }

        // If not found, throw exception
        throw new ResourceLoaderException(`Requested locale with name ${name} not found in the scene! Maybe your scene should load it?`);
    }

    /**
     * Load all given presets
     */
    public async loadAllResources(): Promise<void> {
        // Create promise list
        const promiseList: any[] = [];

        // Push all images to promise list
        for (const element of this.images) {
            // Skip loaded element
            if (element.loaded) {
                continue;
            }

            promiseList.push(this.loadImage(element));
        }

        // Push all fonts to promise list
        for (const element of this.fonts) {
            // Skip loaded element
            if (element.loaded) {
                continue;
            }

            promiseList.push(this.loadFont(element));
        }

        // Push all sounds to promise list
        for (const element of this.sounds) {
            // Skip loaded element
            if (element.loaded) {
                continue;
            }

            promiseList.push(this.loadSound(element));
        }

        // Push all locales to promise list
        for (const element of this.locales) {
            // Skip loaded element
            if (element.loaded) {
                continue;
            }

            promiseList.push(this.loadLocale(element));
        }

        // Load all resources simultaneously
        await Promise.all(promiseList);
    }

    /**
     * Load single image
     */
    private async loadImage(image: ImageType): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => {
                image.object = img;
                image.loaded = true;
                resolve();
            });
            img.addEventListener('error', (err) => reject(err));
            img.src = image.url;
        });
    }

    /**
     * Load font
     */
    private async loadFont(font: FontType): Promise<void> {
        // @ts-ignore
        const f = new FontFace(font.name, `url(${font.url})`);
        const loadedFont = await f.load();
        // @ts-ignore
        document.fonts.add(loadedFont);
        font.loaded = true;
    }

    /**
     * Load sound
     */
    private async loadSound(sound: SoundType): Promise<void> {
        const response = await fetch(sound.url);
        const responseArrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(responseArrayBuffer);
        const audioBufferSourceNode = this.audioContext.createBufferSource();
        audioBufferSourceNode.buffer = audioBuffer;
        sound.object = {
            audioBufferSourceNode,
            currentPlaying: null
        };
        sound.loaded = true;
    }

    /**
     * Load sound
     */
    private async loadLocale(locale: LocaleType): Promise<void> {
        try {
            // Load file
            const response = await fetch(locale.url);

            // Get file body
            const body = await response.text();

            // Put data into class property
            locale.locales = JSON.parse(body);

            // Mark locale as loaded
            locale.loaded = true;
        } catch (error) {
            throw new ResourceLoaderException(`Error occurred while loading ${locale.url}: ${error.message}`);
        }

    }
}