import Vector2 from "./Vector2";

export default class RectCollider {

    public size: Vector2;
    public offset: Vector2;

    /**
     * Constructor
     */
    constructor(size: Vector2, offset: Vector2) {
        this.size = size;
        this.offset = offset;
    }
}