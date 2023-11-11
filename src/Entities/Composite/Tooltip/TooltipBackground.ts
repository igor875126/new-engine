import CircleCollider from "../../../Engine/Colliders/CircleCollider";
import Color from "../../../Engine/Utilities/Color";
import RectCollider from "../../../Engine/Colliders/RectCollider";
import Vector2 from "../../../Engine/Utilities/Vector2";
import RectObject from "../../Primitives/RectObject";

export default class TooltipBackground extends RectObject {

    public width: number = 10;
    public height: number = 10;
    public color: Color = new Color(74, 19, 10, 1);
    public renderingLayer: number = 100;
    public originalPosition: Vector2 = new Vector2(0, 0);
    public position: Vector2 = new Vector2(0, 0);
    public collider: RectCollider | CircleCollider | null = null;
    public affectedByCamera: boolean = true;

    /**
     * Constructor
     */
    constructor(dimensions: Vector2, position: Vector2, color: Color) {
        super();
        this.width = dimensions.x;
        this.height = dimensions.y;
        this.originalPosition = position;
        this.position = position;
        this.color = color;
    }

    /**
     * Set position
     */
    public setPosition(position: Vector2): void {
        this.position = this.originalPosition.add(position);
    }
}