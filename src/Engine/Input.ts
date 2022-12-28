import Vector2 from "./Vector2";
import KeyboardButtonsEnum from "../Enums/KeyboardButtonsEnum";
import MouseButtonsEnum from "../Enums/MouseButtonsEnum";
import InputMouseType from "../Types/InputMouseType";
import InputKeyboardType from "../Types/InputKeyboardType";
import InputTouchType from "../Types/InputTouchType";

export default class Input {

    public mouse: InputMouseType = {
        mousePosition: new Vector2(0, 0),
        mouseButtonsStates: {},
    };
    public keyboard: InputKeyboardType = {
        keyboardButtonsStates: {},
    };
    public touch: InputTouchType = {
        fingersDetected: 0,
        screenIsTouched: false,
        touchPositions: [
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0),
            new Vector2(0, 0),
        ]
    };

    /**
     * Get mouse position
     */
    public getMousePosition(): Vector2 {
        return this.mouse.mousePosition;
    }

    /**
     * Get mouse button down
     */
    public getMouseButtonDown(mouseButtonCode: MouseButtonsEnum): boolean {
        if (this.mouse.mouseButtonsStates[mouseButtonCode]) {
            return true;
        }
        return false;
    }

    /**
     * Get mouse button down
     */
    public getKeyboardButtonDown(keyboardButtonCode: KeyboardButtonsEnum): boolean {
        if (this.keyboard.keyboardButtonsStates[keyboardButtonCode]) {
            return true;
        }
        return false;
    }
}