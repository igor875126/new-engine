import ResourceLoader from "./ResourceLoader";

export default class SoundManager {

    private resourceLoader: ResourceLoader;
    private audioContext: AudioContext;
    private globalVolume: number = 1;

    /**
     * Constructor
     */
    constructor(resourceLoader: ResourceLoader, audioContext: AudioContext) {
        this.resourceLoader = resourceLoader;
        this.audioContext = audioContext;
    }

    /**
     * Play sound
     */
    public play(name: string, loop: boolean = false, volume?: number): void {
        // Get sound by name
        const sound = this.resourceLoader.getSoundByName(name);

        // In case sound object is null
        if (!sound.object) {
            return;
        }

        // Play the sound
        const audioBufferSourceNode = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        // Remember audio buffer source node and gain node
        // This is needed to stop the sound and change it's volume
        sound.object.currentPlaying = {
            audioBufferSourceNode,
            gainNode
        };

        audioBufferSourceNode.buffer = sound.object.audioBufferSourceNode.buffer;
        audioBufferSourceNode.loop = loop;
        gainNode.gain.value = (volume ? volume : this.globalVolume);
        audioBufferSourceNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        audioBufferSourceNode.start(0);
    }

    /**
     * Set volume
     */
    public setVolume(name: string, volume: number): void {
        // Some validations
        if (volume < 0) {
            volume = 0;
        }
        if (volume > 1) {
            volume = 1;
        }

        // Get sound by name
        const sound = this.resourceLoader.getSoundByName(name);

        // In case sound object is null
        if (!sound.object || !sound.object.currentPlaying) {
            return;
        }

        // Set volume
        sound.object.currentPlaying.gainNode.gain.value = volume;
    }

    /**
     * Stop sound
     */
    public stop(name: string): void {
        // Get sound by name
        const sound = this.resourceLoader.getSoundByName(name);

        // In case sound object is null
        if (!sound.object || !sound.object.currentPlaying) {
            return;
        }

        // Stop playing
        sound.object.currentPlaying.audioBufferSourceNode.stop(0);
    }

    /**
     * Set global volume
     */
    public setGlobalVolume(volume: number): void {
        // Some validations
        if (volume <= 0) {
            volume = 0;
        }
        if (volume >= 1) {
            volume = 1;
        }

        this.globalVolume = volume;
    }
}