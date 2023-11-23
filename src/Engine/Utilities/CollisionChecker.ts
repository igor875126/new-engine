import Vector2 from "./Vector2";
import GameObject from "../../Entities/Primitives/GameObject";
import CollisionType from "../../Types/CollisionType";
import IOC from "../Core/IOC";
import Core from "../Core/Core";
import Logger from "./Logger";
import RectCollider from "../../Colliders/RectCollider";
import CircleCollider from "../../Colliders/CircleCollider";

export type CollisionPoint = Vector2;

/**
 * This is a helper class to check collision between different type of shapes
 */
export default class CollisionChecker {

    private core: Core;

    /**
     * Constructor
     */
    constructor() {
        this.core = IOC.makeSingleton('Core');
    }

    /**
     * Find collision point for point inside rectangle, return null if no collision
     */
    public pointInsideRectangleCollision(pointX: number, pointY: number, rectangleX: number, rectangleY: number, rectangleWidth: number, rectangleHeight: number): CollisionPoint | null {
        if (rectangleX <= pointX && pointX <= rectangleX + rectangleWidth && rectangleY <= pointY && pointY <= rectangleY + rectangleHeight) {
            return new Vector2(pointX, pointY);
        }
        return null;
    }

    /**
     * Find collision point for point inside circle, return null if no collision
     */
    public pointInsideCircleCollision(pointX: number, pointY: number, circleX: number, circleY: number, circleRadius: number): Vector2 | null {
        const distanceSquared = (pointX - circleX) * (pointX - circleX) + (pointY - circleY) * (pointY - circleY);
        if (distanceSquared <= circleRadius * circleRadius) {
            return new Vector2(pointX, pointY);
        }
        return null;
    }

    /**
     * Find collision point for two rectangles, return null if no collision
     */
    public rectangleRectangleCollision(x1: number, y1: number, width1: number, height1: number, x2: number, y2: number, width2: number, height2: number): CollisionPoint | null {
        if (
            (x1 + width1) >= x2 &&
            x1 <= (x2 + width2) &&
            (y1 + height1) >= y2 &&
            y1 <= (y2 + height2)
        ) {
            // Top-left corner of the intersection area
            const intersectionX1 = Math.max(x1, x2);
            const intersectionY1 = Math.max(y1, y2);

            // Bottom-right corner of the intersection area
            const intersectionX2 = Math.min(x1 + width1, x2 + width2);
            const intersectionY2 = Math.min(y1 + height1, y2 + height2);

            // Center of the intersection area
            const centerIntersectionX = (intersectionX1 + intersectionX2) / 2;
            const centerIntersectionY = (intersectionY1 + intersectionY2) / 2;

            return new Vector2(centerIntersectionX, centerIntersectionY);
        }

        return null;
    }

    /**
     * Find collision point for two circles, return null if no collision
     */
    public circleCircleCollision(x1: number, y1: number, radius1: number, x2: number, y2: number, radius2: number): Vector2 | null {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > radius1 + radius2) {
            // No collision
            return null;
        }

        // Normalized direction vector
        const nx = dx / distance;
        const ny = dy / distance;

        // Points on the line at a distance of radius1 and radius2 from circle centers
        const p1 = { x: x1 + nx * radius1, y: y1 + ny * radius1 };
        const p2 = { x: x2 - nx * radius2, y: y2 - ny * radius2 };

        // Collision point is the midpoint of p1 and p2
        return new Vector2((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    }

    /**
     * Find collision point for rectangle and circle, return null if no collision
     */
    public rectangleCircleCollision(cx: number, cy: number, radius: number, rx: number, ry: number, rwidth: number, rheight: number): CollisionPoint | null {
        const deltaX = cx - Math.max(rx, Math.min(cx, rx + rwidth));
        const deltaY = cy - Math.max(ry, Math.min(cy, ry + rheight));
        if ((deltaX * deltaX + deltaY * deltaY) < (radius * radius)) {
            return new Vector2(cx - deltaX, cy - deltaY);
        }
        return null;
    }

    /**
     * Check collision between gameObjects
     */
    public checkCollisionBetweenGameObjects(gameObject1: GameObject, gameObject2: GameObject): CollisionType | null {
        // An object cannot collide with itself
        if (gameObject1.name === gameObject2.name) {
            return null;
        }

        // It makes no sense to check for collision when either one or both of the gameObjects have no collider
        if (!gameObject1.collider || !gameObject2.collider) {
            return null;
        }

        // *********************************************************
        // ********************* RECT-RECT *************************
        // *********************************************************
        if (gameObject1.collider instanceof RectCollider && gameObject2.collider instanceof RectCollider) {
            // Check collision
            const collisionPoint = this.rectangleRectangleCollision(
                gameObject1.position.x - gameObject1.collider.size.x / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject1).x,
                gameObject1.position.y - gameObject1.collider.size.y / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject1).y,
                gameObject1.collider.size.x,
                gameObject1.collider.size.y,
                gameObject2.position.x - gameObject2.collider.size.x / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject2).x,
                gameObject2.position.y - gameObject2.collider.size.y / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject2).y,
                gameObject2.collider.size.x,
                gameObject2.collider.size.y
            );

            // In case of collision
            if (collisionPoint) {
                return {
                    gameObject: gameObject1,
                    point: collisionPoint.add(this.core.camera.position),
                };
            }

            // No collision
            return null;
        }
        // *********************************************************
        // ******************* CIRCLE-CIRCLE ***********************
        // *********************************************************
        else if (gameObject1.collider instanceof CircleCollider && gameObject2.collider instanceof CircleCollider) {
            // Check collision
            const collisionPoint = this.circleCircleCollision(
                gameObject1.position.x - this.core.camera.getPositionOffsetForRenderer(gameObject1).x,
                gameObject1.position.y - this.core.camera.getPositionOffsetForRenderer(gameObject1).y,
                gameObject1.collider.radius,
                gameObject2.position.x - this.core.camera.getPositionOffsetForRenderer(gameObject2).x,
                gameObject2.position.y - this.core.camera.getPositionOffsetForRenderer(gameObject2).y,
                gameObject2.collider.radius,
            );

            // In case of collision
            if (collisionPoint) {
                return {
                    gameObject: gameObject1,
                    point: collisionPoint.add(this.core.camera.position),
                };
            }

            // No collision
            return null;
        }
        // *********************************************************
        // ********************* RECT-CIRCLE ***********************
        // *********************************************************
        else if (gameObject1.collider instanceof RectCollider && gameObject2.collider instanceof CircleCollider) {
            // Check collision
            const collisionPoint = this.rectangleCircleCollision(
                gameObject2.position.x - this.core.camera.getPositionOffsetForRenderer(gameObject2).x,
                gameObject2.position.y - this.core.camera.getPositionOffsetForRenderer(gameObject2).y,
                gameObject2.collider.radius,
                gameObject1.position.x - gameObject1.collider.size.x / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject1).x,
                gameObject1.position.y - gameObject1.collider.size.y / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject1).y,
                gameObject1.collider.size.x,
                gameObject1.collider.size.y
            );

            // In case of collision
            if (collisionPoint) {
                return {
                    gameObject: gameObject1,
                    point: collisionPoint.add(this.core.camera.position),
                };
            }

            // No collision
            return null;
        }
        // *********************************************************
        // ********************* CIRCLE-RECT ***********************
        // *********************************************************
        else if (gameObject1.collider instanceof CircleCollider && gameObject2.collider instanceof RectCollider) {
            // Check collision
            const collisionPoint = this.rectangleCircleCollision(
                gameObject1.position.x - this.core.camera.getPositionOffsetForRenderer(gameObject1).x,
                gameObject1.position.y - this.core.camera.getPositionOffsetForRenderer(gameObject1).y,
                gameObject1.collider.radius,
                gameObject2.position.x - gameObject2.collider.size.x / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject2).x,
                gameObject2.position.y - gameObject2.collider.size.y / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject2).y,
                gameObject2.collider.size.x,
                gameObject2.collider.size.y
            );

            // In case of collision
            if (collisionPoint) {
                return {
                    gameObject: gameObject1,
                    point: collisionPoint.add(this.core.camera.position),
                };
            }

            // No collision
            return null;
        }

        Logger.warning(`CollisionChecker.checkCollisionBetweenGameObjects: Unsupported collider types`);
        return null;
    }

    /**
     * Find collision point inside gameObject, return null if no collision
     */
    public pointInsideGameObject(pointPosition: Vector2, gameObject: GameObject): CollisionPoint | null {
        // In case gameObject does not have any collider attached to it
        if (!gameObject.collider) {
            return null;
        }

        // In case gameObjects collider is a rect collider
        if (gameObject.collider instanceof RectCollider) {
            // In case mouse cursor is inside rect collider
            const collisionPoint = this.core.collisionChecker.pointInsideRectangleCollision(
                pointPosition.x,
                pointPosition.y,
                gameObject.position.x - gameObject.collider.size.x / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject).x,
                gameObject.position.y - gameObject.collider.size.y / 2 - this.core.camera.getPositionOffsetForRenderer(gameObject).y,
                gameObject.collider.size.x,
                gameObject.collider.size.y
            );

            // Yep it is inside
            if (collisionPoint) {
                return collisionPoint.add(this.core.camera.position);
            }
        }

        // In case gameObjects collider is a circle collider
        if (gameObject.collider instanceof CircleCollider) {
            // In case mouse cursor is inside circle collider
            const collisionPoint = this.core.collisionChecker.pointInsideCircleCollision(
                pointPosition.x,
                pointPosition.y,
                gameObject.position.x - this.core.camera.getPositionOffsetForRenderer(gameObject).x,
                gameObject.position.y - this.core.camera.getPositionOffsetForRenderer(gameObject).y,
                gameObject.collider.radius
            );

            // Yep it is inside
            if (collisionPoint) {
                return collisionPoint.add(this.core.camera.position);
            }
        }

        // Nope it is not inside collider
        return null;
    }
}