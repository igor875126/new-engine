import Color from "../Engine/Color";
import GameObject from "./GameObject";

export default abstract class RectObject extends GameObject {
    public abstract width: number;
    public abstract height: number;
    public abstract color: Color;
}