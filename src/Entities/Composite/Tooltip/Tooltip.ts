import Vector2 from "../../../Engine/Utilities/Vector2";
import TooltipBackground from "./TooltipBackground";
import EmptyObject from "../../Primitives/EmptyObject";
import CircleCollider from "../../../Engine/Colliders/CircleCollider";
import RectCollider from "../../../Engine/Colliders/RectCollider";
import TooltipText from "./TooltipText";
import Color from "../../../Engine/Utilities/Color";

export default class Tooltip extends EmptyObject {

    public renderingLayer: number = 1;
    public position: Vector2 = new Vector2(0, 0);
    public collider: RectCollider | CircleCollider | null = null;
    public affectedByCamera: boolean = true;

    public tooltipBackground: TooltipBackground;
    private backgroundPadding: number = 20;
    private lineHeight: number = 10;
    private backgroundColor: Color = new Color(255, 255, 0, 1);
    private tooltipTextObjects: TooltipText[][] = [];

    /**
     * Constructor
     */
    constructor(backgroundPadding: number, lineHeight: number, backgroundColor: Color) {
        super();
        this.backgroundPadding = backgroundPadding;
        this.lineHeight = lineHeight;
        this.backgroundColor = backgroundColor;
    }

    /**
     * Destroy tooltip
     */
    public destroy(): void {
        // Destroy background
        this.destroyBackground();

        // Destroy text
        this.destroyText();
    }

    /**
     * Set text
     */
    public setText(text: string, defaultFontSize: number, defaultTextColor: string): void {
        // Destroy background
        this.destroyBackground();

        // Destroy text
        this.destroyText();

        // Assemble tooltip lines
        const tooltipLines = this.assembleTooltipLines(text, defaultFontSize, defaultTextColor);

        // Now iterate through tooltip lines
        let y = 0;
        for (const lineTextParts of tooltipLines) {
            // Now iterate through line text parts
            let x = 0;
            const lineElements: any[] = [];
            for (const element of lineTextParts) {
                const dimensions = this.getTextDimensions(element.textPart, element.size);
                const tooltipText = new TooltipText(element.textPart, element.size, element.color, new Vector2(x + dimensions.width / 2, y));
                lineElements.push(tooltipText);
                x += dimensions.width;
            }
            this.tooltipTextObjects.push(lineElements);
            y += this.lineHeight;
        }

        // Now instantiate all text objects
        for (const line of this.tooltipTextObjects) {
            for (const element of line) {
                this.core.gameObjectsManager.instantiate(element);
            }
        }

        // Create background
        this.createBackground();

        // Set position
        this.setPosition(new Vector2(0, 0));
    }

    /**
     * Set tooltips position
     */
    public setPosition(position: Vector2): void {
        // Calculate offset to move the tooltip to the center of the coordinates
        const offset = new Vector2(this.tooltipBackground.width / 2 - this.backgroundPadding / 2, this.tooltipBackground.height / 2 - this.backgroundPadding / 2 - this.lineHeight / 2);

        // Position with offset
        const positionWithOffset = position.subtract(offset);

        // Adjust position when tooltip is near corners
        const positionAdjustedWhenNearCorners = this.getOffsetWhenTooltipIsNearCorners(positionWithOffset);

        // Remember tooltip position
        this.position = positionAdjustedWhenNearCorners;

        // Move tooltip background
        this.tooltipBackground.setPosition(positionAdjustedWhenNearCorners);

        // Move tooltip text objects
        for (const line of this.tooltipTextObjects) {
            for (const element of line) {
                element.setPosition(positionAdjustedWhenNearCorners);
            }
        }
    }

    /**
     * Get offset when tooltip is near corners
     */
    private getOffsetWhenTooltipIsNearCorners(position: Vector2): Vector2 {
        // Get tooltip corners
        const rightCornerOfTheTooltip = (position.x + this.tooltipBackground.width / 2) + this.tooltipBackground.width / 2 - this.backgroundPadding / 2;
        const leftCornerOfTheTooltip = (position.x - this.tooltipBackground.width / 2) + this.tooltipBackground.width / 2 - this.backgroundPadding / 2;
        const upCornerOfTheTooltip = (position.y - this.tooltipBackground.height / 2) + this.tooltipBackground.height / 2 - this.backgroundPadding / 2 - this.lineHeight / 2;
        const downCornerOfTheTooltip = (position.y + this.tooltipBackground.height / 2) + this.tooltipBackground.height / 2 - this.backgroundPadding / 2 - this.lineHeight / 2;

        // Set offset
        let offsetX = 0;
        let offsetY = 0;
        if (rightCornerOfTheTooltip > this.core.canvas.width) {
            offsetX = rightCornerOfTheTooltip - this.core.canvas.width;
        }
        if (leftCornerOfTheTooltip < 0) {
            offsetX = (0 - leftCornerOfTheTooltip) * -1;
        }
        if (upCornerOfTheTooltip < 0) {
            offsetY = (0 - upCornerOfTheTooltip) * -1;
        }
        if (downCornerOfTheTooltip > this.core.canvas.height) {
            offsetY = downCornerOfTheTooltip - this.core.canvas.height;
        }

        // Return
        return position.subtract(new Vector2(offsetX, offsetY));
    }

    /**
     * Create tooltip background
     */
    private createBackground(): void {
        let maxWidth = 0;
        let maxHeight = 0;
        for (const line of this.tooltipTextObjects) {

            let lineWidth = 0;
            for (const element of line) {
                const dimensions = this.getTextDimensions(element.text, element.fontSize);
                lineWidth += dimensions.width;
            }
            if (lineWidth > maxWidth) {
                maxWidth = lineWidth;
            }

            maxHeight += this.lineHeight;
        }

        // Add padding
        maxWidth += this.backgroundPadding;
        maxHeight += this.backgroundPadding;

        // Now create tooltip background
        this.tooltipBackground = this.core.gameObjectsManager.instantiate(
            new TooltipBackground(
                new Vector2(maxWidth, maxHeight),
                new Vector2(-this.backgroundPadding / 2, -this.backgroundPadding / 2 - this.lineHeight / 2),
                // new Vector2(0, 0),
                this.backgroundColor
            )
        ) as TooltipBackground;
    }

    /**
     * Destroy text
     */
    private destroyText(): void {
        // Destroy previous tooltip text objects
        for (const line of this.tooltipTextObjects) {
            for (const element of line) {
                this.core.gameObjectsManager.destroy(element);
            }
        }
        this.tooltipTextObjects = [];
    }

    /**
     * Destroy background
     */
    private destroyBackground(): void {
        // In case there was already a tooltip background, destroy it
        if (this.tooltipBackground) {
            this.core.gameObjectsManager.destroy(this.tooltipBackground);
        }
    }

    /**
     * Assemble tooltip lines
     */
    private assembleTooltipLines(text: string, defaultFontSize: number, defaultTextColor: string): { textPart: string; size: number; color: string }[][] {
        // Prepare result
        const result: { textPart: string; size: number; color: string }[][] = [];

        // Split text to lines by <br>
        const textSplittedIntoLines = text.split('<br>');

        // Now iterate through each line and parse it
        for (const line of textSplittedIntoLines) {
            // First of all parse text into text parts
            const textParts = this.parseStringIntoTextParts(line);

            // Now convert text parts to special format
            const textPartsInSpecialFormat = this.convertTextPartsToSpecialFormat(textParts, defaultFontSize, defaultTextColor);

            // Push to result
            result.push(textPartsInSpecialFormat);
        }

        // Return
        return result;
    }

    /**
     * Parse string into text parts
     */
    private parseStringIntoTextParts(text: string): string[] {
        // Prepare result
        const result: string[] = [];

        // Initialize intermediate variables
        let tmpPart: string = ``;
        let tagStartFound: boolean = false;

        // Iterate through each text char
        for (let i = 0; i < text.length; i++) {
            // Get previous char
            const previousChar = text[i - 1];

            // Get current char
            const currentChar = text[i];

            // Get next char
            const nextChar = text[i + 1];

            // In case we find <font...
            if (!tagStartFound && currentChar === '<' && nextChar !== '\\') {
                tagStartFound = true;
                result.push(tmpPart);
                tmpPart = currentChar;
                continue;
            }

            // In case we find </font>
            if (tagStartFound && currentChar === '>' && previousChar === 't') {
                tagStartFound = false;
                tmpPart += currentChar;
                result.push(tmpPart);
                tmpPart = ``;
                continue;
            }

            // In case it's a normal text, not closed in tag
            tmpPart += currentChar;

            // In case we've reached text end
            if (i === text.length - 1) {
                result.push(tmpPart);
            }
        }

        // Return
        return result;
    }

    /**
     * Convert text parts to special format
     */
    private convertTextPartsToSpecialFormat(textParts: string[], defaultFontSize: number, defaultTextColor: string): { textPart: string; size: number; color: string }[] {
        // Initialize result
        const result: { textPart: string; size: number; color: string }[] = [];

        // Iterate through text parts
        for (const textPart of textParts) {
            // In case iterating text part contains html tag
            if (textPart.match(/<font/)) {
                // Get size from the html tag
                const sizeMatch = textPart.match(/size="(.*?)"/);
                let size = defaultFontSize;
                if (sizeMatch && sizeMatch[1]) {
                    size = Number(sizeMatch[1]);
                }

                // Get color from the html tag
                const colorMatch = textPart.match(/color="(.*?)"/);
                let color = defaultTextColor;
                if (colorMatch && colorMatch[1]) {
                    color = colorMatch[1];
                }

                // Get body from the tag
                const body = textPart.match(/<font.*>(.*)<\/font>/)![1];
                result.push({ textPart: body, size, color });

                // Continue to next text part
                continue;
            }

            // In case iterating text does not contains html tag
            result.push({ textPart, size: defaultFontSize, color: defaultTextColor });
        }

        // Return
        return result;
    }

    /**
     * Get text dimensions
     */
    private getTextDimensions(text: string, size: number): { width: number; height: number } {
        return new TooltipText(text, size, '', new Vector2(0, 0)).getTextDimensions();
    }
}