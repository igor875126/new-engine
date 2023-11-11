import Vector2 from "../Engine/Utilities/Vector2";

export default interface InputKeyboardType {
    keyboardButtonsStates: { [keyCode: number]: boolean };
}