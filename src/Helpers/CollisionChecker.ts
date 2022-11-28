export default class CollisionChecker {
    /**
     * Check if point is inside rect
     */
    public static pointInsideRectangle(pointX: number, pointY: number, rectangleX: number, rectangleY: number, rectangleWidth: number, rectangleHeight: number): boolean {
        return rectangleX <= pointX && pointX <= rectangleX + rectangleWidth && rectangleY <= pointY && pointY <= rectangleY + rectangleHeight;
    }

    /**
     * Check if point is inside circle
     */
    public static pointInsideCircle(pointX: number, pointY: number, circleX: number, circleY: number, circleRadius: number): boolean {
        const distanceSquared = (pointX - circleX) * (pointX - circleX) + (pointY - circleY) * (pointY - circleY);
        return distanceSquared <= circleRadius * circleRadius;
    }

    // TODO ADD MORE FROM PREDATOR
}