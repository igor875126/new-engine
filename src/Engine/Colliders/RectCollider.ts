import Vector2 from "../Utilities/Vector2";

/**
 * GameObject can have a collider and it could be a RectCollider
 */
export default class RectCollider {

    public size: Vector2;

    /**
     * Constructor
     */
    constructor(size: Vector2) {
        this.size = size;
    }
}