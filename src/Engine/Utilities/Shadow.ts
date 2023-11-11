import Color from "./Color";

export default class Shadow {

    public blurInPixels: number;
    public shadowColor: Color;
    // TODO Add more properties here

    constructor(blurInPixels: number, shadowColor: Color) {
        this.blurInPixels = blurInPixels;
        this.shadowColor = shadowColor;
    }
}