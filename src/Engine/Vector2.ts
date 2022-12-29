export default class Vector2 {

    public x: number;
    public y: number;

    /**
     * Constructor
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Get vectors length (magnitude)
     */
    get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Get normalized vector
     */
    get normalized(): Vector2 {
        const magnitude = this.magnitude;
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }

    /**
     * Get negative vector
     */
    get negative(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    /**
     * Get vector angle
     */
    get angle(): number {
        // Radians
        const angle = Math.atan2(this.y, this.x);

        // You need to divide by PI, and MULTIPLY by 180:
        // Degrees
        const degrees = 180 * angle / Math.PI;

        // Round number, avoid decimal fragments
        return (360 + Math.round(degrees)) % 360;
    }

    /**
     * Distance between two vectors
     */
    public distance(v: Vector2): number {
        return Vector2.distance(this, v);
    }

    /**
     * Distance between two vectors
     */
    public static distance(v1: Vector2, v2: Vector2): number {
        const xDiff = v1.x - v2.x;
        const yDiff = v1.y - v2.y;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    /**
     * Add vector to vector or integer to vector
     */
    public add(v: Vector2 | number): Vector2 {
        return Vector2.add(this, v);
    }

    /**
     * Add vector to vector or integer to vector
     */
    public static add(v1: Vector2, v2: Vector2 | number): Vector2 {
        if (v2 instanceof Vector2) {
            return new Vector2(v1.x + v2.x, v1.y + v2.y);
        }

        return new Vector2(v1.x + v2, v1.y + v2);
    }

    /**
     * Subtract vector from vector or integer from vector
     */
    public subtract(v: Vector2 | number): Vector2 {
        return Vector2.subtract(this, v);
    }

    /**
     * Subtract vector from vector or integer from vector
     */
    public static subtract(v1: Vector2, v2: Vector2 | number): Vector2 {
        if (v2 instanceof Vector2) {
            return new Vector2(v1.x - v2.x, v1.y - v2.y);
        }

        return new Vector2(v1.x - v2, v1.y - v2);
    }

    /**
     * Multiply vector by vector or integer by vector
     */
    public multiply(v: Vector2 | number): Vector2 {
        return Vector2.multiply(this, v);
    }

    /**
     * Multiply vector by vector or integer by vector
     */
    public static multiply(v1: Vector2, v2: Vector2 | number): Vector2 {
        if (v2 instanceof Vector2) {
            return new Vector2(v1.x * v2.x, v1.y * v2.y);
        }

        return new Vector2(v1.x * v2, v1.y * v2);
    }

    /**
     * Divide vector by vector or vector by integer
     */
    public divide(v: Vector2 | number): Vector2 {
        return Vector2.divide(this, v);
    }

    /**
     * Divide vector by vector or vector by integer
     */
    public static divide(v1: Vector2, v2: Vector2 | number): Vector2 {
        if (v2 instanceof Vector2) {
            return new Vector2(v1.x / v2.x, v1.y / v2.y);
        }

        return new Vector2(v1.x / v2, v1.y / v2);
    }

    /**
     * Returns vector from angles
     */
    public static fromAngles(theta: number, phi: number): Vector2 {
        return new Vector2(Math.cos(theta) * Math.cos(phi), Math.sin(phi));
    }

    /**
     * Returns random direction
     */
    public static randomDirection(): Vector2 {
        return Vector2.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
    }

    /**
     * Dot vector1 and vector2 (scalar)
     */
    public dot(v: Vector2): number {
        return Vector2.dot(this, v);
    }

    /**
     * Dot vector1 and vector2 (scalar)
     */
    public static dot(v1: Vector2, v2: Vector2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    /**
     * Returns angle between two vectors
     */
    public static angleBetween(v1: Vector2, v2: Vector2): number {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;

        // Range from 0 to 360
        if (angle < 0)
            angle = 360 + angle;

        return angle;
    }

    /**
     * Interpolates to v by fraction
     */
    public lerp(v: Vector2, fraction: number): Vector2 {
        return Vector2.lerp(this, v, fraction);
    }

    /**
     * Interpolates v1 to v2 by fraction
     */
    public static lerp(v1: Vector2, v2: Vector2, fraction: number): Vector2 {
        return Vector2.add(Vector2.multiply(Vector2.subtract(v2, v1), fraction), v1);
    }

    /**
     * Rotates a vector by degrees
     */
    public rotate(degrees: number): Vector2 {
        const resultingVector = Vector2.rotate(this, degrees);
        this.x = resultingVector.x;
        this.y = resultingVector.y;
        return this;
    }

    /**
     * Rotates a vector by degrees
     */
    public static rotate(v: Vector2, degrees: number): Vector2 {
        const theta = degrees * (Math.PI / 180);
        const cs = Math.cos(theta);
        const sn = Math.sin(theta);
        const px = v.x * cs - v.y * sn;
        const py = v.x * sn + v.y * cs;
        return new Vector2(px, py);
    }
}