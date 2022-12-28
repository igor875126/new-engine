import Vector2 from "../Engine/Vector2";

export default interface InputKeyboardType {
    keyboardButtonsStates: { [keyCode: number]: boolean };
}