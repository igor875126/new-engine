export default class Mathf {
    /**
     * Lerp
     */
    public static lerp(a: number, b: number, fraction: number): number {
        return (1.0 - fraction) * a + b * fraction;
    }
}