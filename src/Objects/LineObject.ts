import Color from "../Engine/Color";
import Vector2 from "../Engine/Vector2";
import GameObject from "./GameObject";

export default abstract class LineObject extends GameObject {
    public abstract lineWidth: number;
    public abstract endPoint: Vector2;
    public abstract color: Color;
}