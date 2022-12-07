import GameObject from "../Objects/GameObject";
import Core from "./Core";
import Vector2 from "./Vector2";

export default class Camera {

    public position: Vector2 = new Vector2(0, 0);
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
}