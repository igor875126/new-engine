import Vector2 from "../Engine/Utilities/Vector2";

export default interface InputMouseType {
    mousePosition: Vector2;
    mouseButtonsStates: { [keyCode: number]: boolean };
}