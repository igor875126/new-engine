import CircleCollider from "../../Colliders/CircleCollider";
import IOC from "../../Engine/Core/IOC";
import Core from "../../Engine/Core/Core";
import RectCollider from "../../Colliders/RectCollider";
import Vector2 from "../../Engine/Utilities/Vector2";
import Random from "../../Helpers/Random";
import CollisionType from "../../Types/CollisionType";

export default abstract class GameObject {

    public name: string;
    public abstract renderingLayer: number;
    public abstract position: Vector2;
    public abstract collider: RectCollider | CircleCollider | null;
    public abstract affectedByCamera: boolean;
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
    public onMouseClick(collisionPoint: Vector2): void {
        // Do something when mouse clicks on the object
    }

    /**
     * On mouse over
     */
    public onMouseOver(collisionPoint: Vector2): void {
        // Do something when mouse is over
    }

    /**
     * On mouse out
     */
    public onMouseOut(): void {
        // Do something when mouse is out
    }

    /**
     * On collision
     */
    public onCollision(collision: CollisionType): void {
        // Do something when collision happened
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