import Vector2 from "./Vector2";
import KeyboardButtonsEnum from "../Enums/KeyboardButtonsEnum";
import MouseButtonsEnum from "../Enums/MouseButtonsEnum";

export default class Input {

    public mousePosition: Vector2 = new Vector2(0, 0);
    public mouseButtonsStates: { [keyCode: number]: boolean } = {};
    public keyboardButtonsStates: { [keyCode: number]: boolean } = {};

    /**
     * Get mouse position
     */
    public getMousePosition(): Vector2 {
        return this.mousePosition;
    }

    /**
     * Get mouse button down
     */
    public getMouseButtonDown(mouseButtonCode: MouseButtonsEnum): boolean {
        if (this.mouseButtonsStates[mouseButtonCode]) {
            return true;
        }
        return false;
    }

    /**
     * Get mouse button down
     */
    public getKeyboardButtonDown(keyboardButtonCode: KeyboardButtonsEnum): boolean {
        if (this.keyboardButtonsStates[keyboardButtonCode]) {
            return true;
        }
        return false;
    }
}