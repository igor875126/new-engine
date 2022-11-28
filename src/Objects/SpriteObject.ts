import Color from "../Engine/Color";
import Sprite from "../Engine/Sprite";
import GameObject from "./GameObject";

export default abstract class SpriteObject extends GameObject {
    public abstract width: number;
    public abstract height: number;
    public abstract angle: number;
    public abstract sprite: Sprite | null;
    public abstract color: Color;
}