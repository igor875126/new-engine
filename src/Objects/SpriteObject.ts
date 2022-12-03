import Color from "../Engine/Color";
import Shadow from "../Engine/Shadow";
import Sprite from "../Engine/Sprite";
import GameObject from "./GameObject";

export default abstract class SpriteObject extends GameObject {
    public abstract width: number;
    public abstract height: number;
    public abstract angle: number;
    public abstract sprite: Sprite | null;
    public abstract shadow: Shadow | null;
    public abstract color: Color;
}