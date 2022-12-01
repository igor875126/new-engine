import Color from "../Engine/Color";
import GameObject from "./GameObject";

export default abstract class TextObject extends GameObject {

    public text: string;
    public abstract fontName: string;
    public abstract fontSize: number;
    public abstract color: Color;
    private cachedTextMetaInformation: string = '';
    private cachedTextDimensions: { width: number; height: number } = { width: 0, height: 0 };

    /**
     * Get text dimensions in pixels
     */
    public getTextDimensions(): { width: number; height: number } {
        // Get text meta information
        const textMetaInformation = this.getTextMetaInformation();

        // In case meta information is the same
        if (textMetaInformation === this.cachedTextMetaInformation) {
            return this.cachedTextDimensions;
        }

        // Determine text dimensions
        this.core.renderer.context.font = `${this.fontSize}px ${this.fontName}`;
        const textDimensions = this.core.renderer.context.measureText(this.text);

        // Prepare result
        const result = {
            width: Math.ceil(textDimensions.width),
            height: Math.ceil(textDimensions.actualBoundingBoxAscent)
        };

        // Cache
        this.cachedTextDimensions = result;
        this.cachedTextMetaInformation = textMetaInformation;

        // Return
        return result;
    }

    /**
     * Get text meta information
     */
    private getTextMetaInformation(): string {
        return this.text + this.fontName + this.fontSize;
    }
}