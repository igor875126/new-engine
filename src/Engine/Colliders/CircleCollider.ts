import Vector2 from "../Utilities/Vector2";

/**
 * GameObject can have a collider and it could be a CircleCollider
 */
export default class CircleCollider {

    public radius: number;

    /**
     * Constructor
     */
    constructor(radius: number) {
        this.radius = radius;
    }
}