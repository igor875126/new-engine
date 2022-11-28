import Color from "../Engine/Color";
import GameObject from "./GameObject";

export default abstract class TextObject extends GameObject {
    public abstract text: string;
    public abstract font: string;
    public abstract color: Color;
}