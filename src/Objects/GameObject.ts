import CircleCollider from "../Engine/CircleCollider";
import Core from "../Engine/Core";
import IOC from "../Engine/IOC";
import RectCollider from "../Engine/RectCollider";
import Vector2 from "../Engine/Vector2";
import Random from "../Helpers/Random";

export default abstract class GameObject {

    public name: string;
    public abstract renderingLayer: number;
    public abstract position: Vector2;
    public abstract collider: RectCollider | CircleCollider | null;
    public abstract unaffectedByCamera: boolean;
    public core: Core;

    /**
     * Constructor
     */
    constructor() {
        this.name = `gameObject-${Random.getRandomString(8)}`;
        this.core = IOC.makeSingleton('Core');
    }

    /**
     * Called after instantiation
     */
    public start(): void {
        // ...
    }

    /**
     * Called every frame
     */
    public update(): void {
        // ...
    }

    /**
     * On mouse click
     */
    public onMouseClick(): void {
        // Do something when mouse clicks on the object
    }

    /**
     * On mouse over
     */
    public onMouseOver(): void {
        // Do something when mouse is over
    }

    /**
     * On mouse out
     */
    public onMouseOut(): void {
        // Do something when mouse is out
    }

    /**
     * On window focus loose
     */
    public onWindowFocusLoose(): void {
        // Do something when window looses focus
    }

    /**
     * On window focus gain
     */
    public onWindowFocusGain(): void {
        // Do something when window gains focus
    }

    /**
     * On window resized
     */
    public onWindowResized(): void {
        // Do something when window got resized
    }
}