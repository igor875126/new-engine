import Vector2 from "./Vector2";

/**
 * GameObject can have a collider and it could be a CircleCollider
 */
export default class CircleCollider {

    public radius: number;
    public offset: Vector2;

    /**
     * Constructor
     */
    constructor(radius: number, offset: Vector2) {
        this.radius = radius;
        this.offset = offset;
    }
}