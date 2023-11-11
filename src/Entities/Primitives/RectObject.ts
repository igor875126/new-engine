import GameObject from "./GameObject";
import Color from "../../Engine/Utilities/Color";

export default abstract class RectObject extends GameObject {
    public abstract width: number;
    public abstract height: number;
    public abstract color: Color;
}