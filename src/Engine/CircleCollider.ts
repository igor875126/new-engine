import Vector2 from "./Vector2";

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