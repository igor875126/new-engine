import Color from "../Engine/Color";
import GameObject from "./GameObject";

export default abstract class CircleObject extends GameObject {
    public abstract radius: number;
    public abstract color: Color;
}