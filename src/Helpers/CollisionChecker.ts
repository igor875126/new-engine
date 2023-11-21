import CircleCollider from "../Engine/Colliders/CircleCollider";
import RectCollider from "../Engine/Colliders/RectCollider";
import { ScalingManager } from "../Engine/Core/ScalingManager";
import Camera from "../Engine/Utilities/Camera";
import Logger from "../Engine/Utilities/Logger";
import Vector2 from "../Engine/Utilities/Vector2";
import GameObject from "../Entities/Primitives/GameObject";
import CollisionType from "../Types/CollisionType";

/**
 * This is a helper class to check collision between different type of shapes
 */
export default class CollisionChecker {
    /**
     * Find collision point for point inside rectangle, return null if no collision
     */
    public static pointInsideRectangleCollision(pointX: number, pointY: number, rectangleX: number, rectangleY: number, rectangleWidth: number, rectangleHeight: number): Vector2 | null {
        if (rectangleX <= pointX && pointX <= rectangleX + rectangleWidth && rectangleY <= pointY && pointY <= rectangleY + rectangleHeight) {
            return new Vector2(pointX, pointY);
        }
        return null;
    }

    /**
     * Find collision point for point inside circle, return null if no collision
     */
    public static pointInsideCircleCollision(pointX: number, pointY: number, circleX: number, circleY: number, circleRadius: number): Vector2 | null {
        const distanceSquared = (pointX - circleX) * (pointX - circleX) + (pointY - circleY) * (pointY - circleY);
        if (distanceSquared <= circleRadius * circleRadius) {
            return new Vector2(pointX, pointY);
        }
        return null;
    }

    /**
     * Find collision point for two rectangles, return null if no collision
     */
    public static rectangleRectangleCollision(x1: number, y1: number, width1: number, height1: number, x2: number, y2: number, width2: number, height2: number): Vector2 | null {
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
    public static circleCircleCollision(x1: number, y1: number, radius1: number, x2: number, y2: number, radius2: number): Vector2 | null {
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
    public static rectangleCircleCollision(cx: number, cy: number, radius: number, rx: number, ry: number, rwidth: number, rheight: number): Vector2 | null {
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
    public static checkCollisionBetweenGameObjects(gameObject1: GameObject, gameObject2: GameObject, scalingManager: ScalingManager, camera: Camera): CollisionType | null {
        // An object cannot collide with itself
        if (gameObject1.name === gameObject2.name) {
            return null;
        }

        // It makes no sense to check for collision when either one or both of the gameObjects have no collider
        if (!gameObject1.collider || !gameObject2.collider) {
            return null;
        }

        // Calculate scaling
        const go1ScaledPosition = scalingManager.virtualToScreen(gameObject1.position);
        const go1ScaledCameraOffset = scalingManager.virtualToScreen(camera.getPositionOffsetForRenderer(gameObject1));
        const go1ResultingPosition = go1ScaledPosition.subtract(go1ScaledCameraOffset);
        const go2ScaledPosition = scalingManager.virtualToScreen(gameObject2.position);
        const go2ScaledCameraOffset = scalingManager.virtualToScreen(camera.getPositionOffsetForRenderer(gameObject2));
        const go2ResultingPosition = go2ScaledPosition.subtract(go2ScaledCameraOffset);


        if (gameObject1.collider instanceof RectCollider && gameObject2.collider instanceof RectCollider) {
            // *********************************************************
            // ********************* RECT-RECT *************************
            // *********************************************************
            const go1ScaledSize = scalingManager.boxSizeVirtualToScreen(gameObject1.collider.size);
            const go2ScaledSize = scalingManager.boxSizeVirtualToScreen(gameObject2.collider.size);

            // Check collision
            const collision = CollisionChecker.rectangleRectangleCollision(
                go1ResultingPosition.x - go1ScaledSize.x / 2, go1ResultingPosition.y - go1ScaledSize.y / 2, go1ScaledSize.x, go1ScaledSize.y,
                go2ResultingPosition.x - go2ScaledSize.x / 2, go2ResultingPosition.y - go2ScaledSize.y / 2, go2ScaledSize.x, go2ScaledSize.y,
            );

            // In case of collision
            if (collision) {
                return {
                    gameObject: gameObject2,
                    point: scalingManager.screenToVirtual(collision).add(camera.position),
                };
            }

            // No collision
            return null;

        } else if (gameObject1.collider instanceof CircleCollider && gameObject2.collider instanceof CircleCollider) {
            // *********************************************************
            // ******************* CIRCLE-CIRCLE ***********************
            // *********************************************************
            const go1ScaledSize = scalingManager.circleRadiusVirtualToScreen(gameObject1.collider.radius);
            const go2ScaledSize = scalingManager.circleRadiusVirtualToScreen(gameObject2.collider.radius);

            // Check collision
            const collision = CollisionChecker.circleCircleCollision(
                go1ResultingPosition.x, go1ResultingPosition.y, go1ScaledSize,
                go2ResultingPosition.x, go2ResultingPosition.y, go2ScaledSize,
            );

            // In case of collision
            if (collision) {
                return {
                    gameObject: gameObject2,
                    point: scalingManager.screenToVirtual(collision).add(camera.position),
                };
            }

            // No collision
            return null;
        } else if (gameObject1.collider instanceof RectCollider && gameObject2.collider instanceof CircleCollider) {
            // *********************************************************
            // ********************* RECT-CIRCLE ***********************
            // *********************************************************
            const go1ScaledSize = scalingManager.boxSizeVirtualToScreen(gameObject1.collider.size);
            const go2ScaledSize = scalingManager.circleRadiusVirtualToScreen(gameObject2.collider.radius);

            // Check collision
            const collision = CollisionChecker.rectangleCircleCollision(
                go2ResultingPosition.x, go2ResultingPosition.y, go2ScaledSize,
                go1ResultingPosition.x - go1ScaledSize.x / 2, go1ResultingPosition.y - go1ScaledSize.y / 2, go1ScaledSize.x, go1ScaledSize.y,
            );

            // In case of collision
            if (collision) {
                return {
                    gameObject: gameObject2,
                    point: scalingManager.screenToVirtual(collision).add(camera.position),
                };
            }

            // No collision
            return null;
        } else if (gameObject1.collider instanceof CircleCollider && gameObject2.collider instanceof RectCollider) {
            // *********************************************************
            // ********************* CIRCLE-RECT ***********************
            // *********************************************************
            const go1ScaledSize = scalingManager.circleRadiusVirtualToScreen(gameObject1.collider.radius);
            const go2ScaledSize = scalingManager.boxSizeVirtualToScreen(gameObject2.collider.size);

            // Check collision
            const collision = CollisionChecker.rectangleCircleCollision(
                go1ResultingPosition.x, go1ResultingPosition.y, go1ScaledSize,
                go2ResultingPosition.x - go2ScaledSize.x / 2, go2ResultingPosition.y - go2ScaledSize.y / 2, go2ScaledSize.x, go2ScaledSize.y,
            );

            // In case of collision
            if (collision) {
                return {
                    gameObject: gameObject2,
                    point: scalingManager.screenToVirtual(collision).add(camera.position),
                };
            }

            // No collision
            return null;
        }

        Logger.warning(`CollisionChecker.checkCollisionBetweenGameObjects: Unsupported collider types`);
        return null;
    }
}