import CircleCollider from "../../../Engine/Colliders/CircleCollider";
import Color from "../../../Engine/Utilities/Color";
import RectCollider from "../../../Engine/Colliders/RectCollider";
import Vector2 from "../../../Engine/Utilities/Vector2";
import TextObject from "../../Primitives/TextObject";

export default class TooltipText extends TextObject {

    public text: string;
    public fontName: string = 'Arial';
    public fontSize: number = 18;
    public color: Color = new Color(255, 255, 255, 1);
    public renderingLayer: number = 101;
    public originalPosition: Vector2 = new Vector2(0, 0);
    public position: Vector2 = new Vector2(0, 0);
    public collider: RectCollider | CircleCollider | null = null;
    public affectedByCamera: boolean = true;

    /**
     * Constructor
     */
    constructor(text: string, fontSize: number, hexColor: string, position: Vector2) {
        super();
        this.text = text;
        this.fontSize = fontSize;
        this.color = Color.hexToRgb(hexColor);
        this.originalPosition = position;
        this.position = position;
    }

    /**
     * Set position
     */
    public setPosition(position: Vector2): void {
        this.position = this.originalPosition.add(position);
    }
}