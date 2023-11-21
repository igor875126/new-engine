import Vector2 from "../Engine/Utilities/Vector2";
import GameObject from "../Entities/Primitives/GameObject";

export default interface CollisionType {
    gameObject: GameObject; // Collided with gameObject
    point: Vector2;         // Collision point
}