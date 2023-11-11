import GameObject from "./GameObject";
import Color from "../../Engine/Utilities/Color";
import Shadow from "../../Engine/Utilities/Shadow";
import Sprite from "../../Engine/Utilities/Sprite";

export default abstract class SpriteObject extends GameObject {
    public abstract width: number;
    public abstract height: number;
    public abstract angle: number;
    public abstract sprite: Sprite | null;
    public abstract shadow: Shadow | null;
    public abstract color: Color;
}