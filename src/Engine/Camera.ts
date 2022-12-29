import Helper from "../Helpers/Helper";
import Random from "../Helpers/Random";
import GameObject from "../Objects/GameObject";
import Core from "./Core";
import Time from "./Time";
import Vector2 from "./Vector2";

export default class Camera {

    public position: Vector2 = new Vector2(0, 0);
    private shakeOriginalPosition: Vector2 = new Vector2(0, 0);
    private core: Core;

    /**
     * Constructor
     */
    constructor(core: Core) {
        this.core = core;
    }

    /**
     * Get position offset for renderer
     */
    public getPositionOffsetForRenderer(gameObject: GameObject): Vector2 {
        if (gameObject.unaffectedByCamera) {
            return new Vector2(0, 0);
        }
        return new Vector2(this.position.x - this.core.canvas.width / 2, this.position.y - this.core.canvas.height / 2);
    }

    /**
     * Shake camera
     */
    public async shake(durationInMs: number, intensity: number): Promise<void> {
        // Remember original camera position
        this.shakeOriginalPosition = this.position;

        // Calculate decrease intensity
        const decreaseIntensityBy = intensity / (durationInMs / 10);

        // Shake camera until we are in time
        while (durationInMs > 0) {
            // Calculate x,y shake offset
            const x = Random.getRandomNumberBetween(-intensity, intensity);
            const y = Random.getRandomNumberBetween(-intensity, intensity);

            // Change camera position
            this.position = this.position.add(new Vector2(x, y));

            // Sleep
            await Helper.sleep(10);

            // Subtract duration, we want that the loop at one point ends
            durationInMs -= 10;

            // Decrease intensity
            intensity -= decreaseIntensityBy;

            // Restore camera to it's original position
            this.position = this.shakeOriginalPosition;
        }
    }
}