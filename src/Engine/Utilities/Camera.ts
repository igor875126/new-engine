import Helper from "../../Helpers/Helper";
import Random from "../../Helpers/Random";
import GameObject from "../../Entities/Primitives/GameObject";
import Vector2 from "./Vector2";

/**
 * The Camera class serves as a component within a game or application's rendering system
 * and is responsible for managing the position of the in-game camera.
 * It offers functionality for tracking and offsetting the camera's position for rendering,
 * as well as creating a shaking effect to add dynamism to the visual presentation.
 */
export default class Camera {

    public position: Vector2 = new Vector2(0, 0);
    private shakeOriginalPosition: Vector2 = new Vector2(0, 0);

    /**
     * Get position offset for renderer
     */
    public getPositionOffsetForRenderer(gameObject: GameObject): Vector2 {
        if (!gameObject.affectedByCamera) {
            return new Vector2(0, 0);
        }
        return new Vector2(this.position.x, this.position.y);
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