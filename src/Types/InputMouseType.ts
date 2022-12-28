import Vector2 from "../Engine/Vector2";

export default interface InputMouseType {
    mousePosition: Vector2;
    mouseButtonsStates: { [keyCode: number]: boolean };
}