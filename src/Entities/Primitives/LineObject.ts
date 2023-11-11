import GameObject from "./GameObject";
import Vector2 from "../../Engine/Utilities/Vector2";
import Color from "../../Engine/Utilities/Color";

export default abstract class LineObject extends GameObject {
    public abstract lineWidth: number;
    public abstract endPoint: Vector2;
    public abstract color: Color;
}