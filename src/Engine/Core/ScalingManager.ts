import Vector2 from "../Utilities/Vector2";

/**
 * The ScalingManager class is designed to manage the scaling of a web application's graphical elements.
 * It calculates the scale factor based on the current window size relative to a reference resolution.
 * This class is useful for responsive designs where elements need to be scaled according to different screen sizes.
 */
export class ScalingManager {

    private referenceResolution: Vector2;   // Stores the reference resolution for scaling calculations
    private currentResolution: Vector2;     // Stores the current resolution of the window
    private scale: Vector2;                 // Stores the calculated scale factor

    /**
     * Constructor
     */
    constructor(referenceResolution: Vector2) {
        this.referenceResolution = referenceResolution;
        this.updateScale();
        window.addEventListener('resize', this.updateScale.bind(this));
    }

    /**
     * Update the scaling factors based on the current window size.
     * It calculates the scale factor by dividing the current resolution by the reference resolution.
     */
    private updateScale(): void {
        this.currentResolution = new Vector2(window.innerWidth, window.innerHeight);
        this.scale = new Vector2(
            this.currentResolution.x / this.referenceResolution.x,
            this.currentResolution.y / this.referenceResolution.y
        );
    }

    /**
     * Get the current scale factor.
     */
    public getScale(): Vector2 {
        return this.scale;
    }

    /**
     * Converts a virtual position (based on reference resolution) to the corresponding screen position.
     */
    public virtualToScreen(position: Vector2): Vector2 {
        return new Vector2(
            position.x * this.scale.x,
            position.y * this.scale.y
        );
    }

    /**
     * Converts a screen position to the corresponding virtual position (based on reference resolution).
     */
    public screenToVirtual(position: Vector2): Vector2 {
        return new Vector2(
            position.x / this.scale.x,
            position.y / this.scale.y
        );
    }
}