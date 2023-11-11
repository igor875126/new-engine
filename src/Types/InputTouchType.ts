import Vector2 from "../Engine/Utilities/Vector2";

export default interface InputTouchType {
    fingersDetected: number;
    screenIsTouched: boolean;
    touchPositions: Vector2[];
}