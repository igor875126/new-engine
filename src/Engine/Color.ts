export default class Color {

    public r: number;
    public g: number;
    public b: number;
    private _a: number;

    /**
     * Constructor
     */
    constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this._a = a;
    }

    /**
     * Setter for hex value
     */
    public set hex(hex: string) {
        const color = this.hexToRgb(hex);
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this._a = color.a;
    }

    /**
     * Getter for hex value
     */
    public get hex() {
        return this.rgbaToHex();
    }

    /**
     * Alpha getter
     */
    public get a() {
        return this._a;
    }

    /**
     * Alpha setter
     */
    public set a(a) {
        // Some controlling that alpha does not go over 1 and don't fall below 0
        // It is important because otherwise object disappears
        if (a < 0) {
            this._a = 0;
        }
        else if (a > 1) {
            this._a = 1;
        }
        else {
            this._a = a;
        }
    }

    /**
     * Get rgba
     */
    public getRgba(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this._a})`;
    }

    /**
     * Set rgba
     */
    public setRgba(color: Color): void {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }

    /**
     * Helper method which converts hex to rgb
     */
    public hexToRgb(hex: string): Color {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return new Color(r, g, b, 1);
    }

    /**
     * Helper method which converts rgba to hex
     */
    private rgbaToHex(): string {
        let r = this.r.toString(16);
        let g = this.g.toString(16);
        let b = this.b.toString(16);
        let a = Math.round(this._a * 255).toString(16);

        if (r.length === 1)
            r = "0" + r;
        if (g.length === 1)
            g = "0" + g;
        if (b.length === 1)
            b = "0" + b;
        if (a.length === 1)
            a = "0" + a;

        return "#" + r + g + b + a;
    }
}
