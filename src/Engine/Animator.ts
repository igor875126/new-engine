import Random from "../Helpers/Random";
import Sprite from "./Sprite";
import Time from "./Time";

export default class Animator {

    private frames: { [key: string]: Sprite[] } = {};
    private currentPlaying: { name: string | null, frame: number, startTime: number, playbackSpeed: number, playbackMode: 'loop' | 'once' | 'randomSingle' } = {
        name: null,
        frame: 0,
        startTime: 0,
        playbackSpeed: 0,
        playbackMode: 'loop'
    };

    /**
     * Add frame to animator
     */
    public addFrame(animationName: string, sprite: Sprite): void {
        if (!this.frames[animationName]) {
            this.frames[animationName] = [];
        }
        this.frames[animationName].push(sprite);
    }

    /**
     * Play loop
     */
    public playLoop(animationName: string, playbackSpeed: number): void {
        this.currentPlaying.name = animationName;
        this.currentPlaying.frame = 0;
        this.currentPlaying.startTime = Time.timestamp;
        this.currentPlaying.playbackSpeed = playbackSpeed;
        this.currentPlaying.playbackMode = 'loop';
    }

    /**
     * Play once
     */
    public playOnce(animationName: string, playbackSpeed: number): void {
        this.currentPlaying.name = animationName;
        this.currentPlaying.frame = 0;
        this.currentPlaying.startTime = Time.timestamp;
        this.currentPlaying.playbackSpeed = playbackSpeed;
        this.currentPlaying.playbackMode = 'once';
    }

    /**
     * Play single random frame
     */
    public playSingleRandomFrame(animationName: string): void {
        this.currentPlaying.name = animationName;
        this.currentPlaying.frame = Random.getRandomNumberBetween(0, this.frames[this.currentPlaying.name].length);
        this.currentPlaying.startTime = Time.timestamp;
        this.currentPlaying.playbackSpeed = 0;
        this.currentPlaying.playbackMode = 'randomSingle';
    }

    /**
     * Get sprite for drawing
     */
    public getSpriteForDrawing(): Sprite | null {
        // In case no animations should currently played back
        if (!this.currentPlaying.name) {
            return null;
        }

        // Prepare resulting sprite
        const resultingSprite = this.frames[this.currentPlaying.name][this.currentPlaying.frame];

        // Increment frame number
        this.incrementFrameNumber();

        // Return
        return resultingSprite;
    }

    /**
     * Increment frame number of played back animation
     */
    private incrementFrameNumber(): void {
        // In case there is not played back animation
        if (!this.currentPlaying.name) {
            return;
        }

        // If our real world timestamp has passed animation "sleep time"
        if (Time.timestamp >= this.currentPlaying.startTime + this.currentPlaying.playbackSpeed) {
            // Reset start time of current playing animation
            this.currentPlaying.startTime = Time.timestamp;

            // In case there are some frames left, where we can step to
            if (this.currentPlaying.frame < this.frames[this.currentPlaying.name].length - 1) {
                this.currentPlaying.frame++;
                return;
            }

            // Nope no frames left, start from the beginning
            if (this.currentPlaying.playbackMode === 'loop') {
                this.currentPlaying.frame = 0;
            }
        }
    }
}