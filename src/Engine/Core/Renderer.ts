import CircleObject from "../../Entities/Primitives/CircleObject";
import GameObject from "../../Entities/Primitives/GameObject";
import LineObject from "../../Entities/Primitives/LineObject";
import RectObject from "../../Entities/Primitives/RectObject";
import SpriteObject from "../../Entities/Primitives/SpriteObject";
import TextObject from "../../Entities/Primitives/TextObject";
import CoreOptionsType from "../../Types/CoreOptionsType";
import Camera from "../Utilities/Camera";
import CircleCollider from "../Colliders/CircleCollider";
import RectCollider from "../Colliders/RectCollider";
import { ScalingManager } from "./ScalingManager";
import Time from "../Utilities/Time";
import Vector2 from "../Utilities/Vector2";

export default class Renderer {

    public canvas: HTMLCanvasElement;
    public canvasCenter: Vector2;
    public context: CanvasRenderingContext2D;
    public camera: Camera;
    public scalingManager: ScalingManager;
    public options: CoreOptionsType['rendererOptions'];
    private renderQueue: GameObject[] = [];
    private debug: { colliderRenderingEnabled: boolean, fpsRenderingEnabled: boolean } = { colliderRenderingEnabled: false, fpsRenderingEnabled: false, };

    /**
     * Constructor
     */
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, camera: Camera, scalingManager: ScalingManager, options: CoreOptionsType['rendererOptions']) {
        this.canvas = canvas;
        this.context = context;
        this.camera = camera;
        this.scalingManager = scalingManager;
        this.options = options;
        this.resizeCanvas();
    }

    /**
     * Adds object to drawing queue
     */
    public addToDrawingQueue(gameObject: GameObject): void {
        this.renderQueue.push(gameObject);
    }

    /**
     * Draws all object from render queue
     */
    public flush(): void {
        // Wait until camera get's ready
        if (!this.camera) {
            return;
        }

        // Clear the viewport
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Sort rendering queue by renderingLayer asc
        this.renderQueue = this.renderQueue.sort((a, b) => (a.renderingLayer > b.renderingLayer) ? 1 : -1);

        // Draw gameObjects from render queue array
        for (const gameObject of this.renderQueue) {
            this.renderRect(gameObject);
            this.renderCircle(gameObject);
            this.renderSprite(gameObject);
            this.renderText(gameObject);
            this.renderLine(gameObject);

            // In case debug collider rendering is enabled
            if (this.debug.colliderRenderingEnabled) {
                this.renderCollider(gameObject);
            }
        }

        // In case debug fps rendering is enabled
        if (this.debug.fpsRenderingEnabled) {
            this.renderFps();
        }

        // Clear render queue
        this.renderQueue = [];
    }

    /**
     * Resize canvas
     */
    public resizeCanvas(): void {
        // Change canvas width and height
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // After canvas resize, remember the center of the canvas
        this.canvasCenter = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
    }

    /**
     * Toggle debug fps rendering
     */
    public toggleDebugFpsRendering(): void {
        this.debug.fpsRenderingEnabled = !this.debug.fpsRenderingEnabled;
    }

    /**
     * Toggle debug fps rendering
     */
    public toggleDebugColliderRendering(): void {
        this.debug.colliderRenderingEnabled = !this.debug.colliderRenderingEnabled;
    }

    /**
     * Render rect
     */
    private renderRect(gameObject: GameObject): void {
        // In case game object is not the type we want to render
        if (!(gameObject instanceof RectObject)) {
            return;
        }

        // Calculate scaling
        const scaledPosition = this.scalingManager.virtualToScreen(gameObject.position);
        const scaledSize = this.scalingManager.boxSizeVirtualToScreen(new Vector2(gameObject.width, gameObject.height));
        const scaledCameraOffset = this.scalingManager.virtualToScreen(this.camera.getPositionOffsetForRenderer(gameObject));
        const resultingPosition = scaledPosition.subtract(scaledSize.divide(2)).subtract(scaledCameraOffset);

        // Draw in context
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = gameObject.color.getRgba();
        this.context.fillRect(resultingPosition.x, resultingPosition.y, scaledSize.x, scaledSize.y);
        this.context.stroke();
        this.context.restore();
    }

    /**
     * Render circle
     */
    private renderCircle(gameObject: GameObject): void {
        // In case game object is not the type we want to render
        if (!(gameObject instanceof CircleObject)) {
            return;
        }

        // Calculate scaling
        const scaledPosition = this.scalingManager.virtualToScreen(gameObject.position);
        const scaledCameraOffset = this.scalingManager.virtualToScreen(this.camera.getPositionOffsetForRenderer(gameObject));
        const resultingPosition = scaledPosition.subtract(scaledCameraOffset);
        const scaledRadius = this.scalingManager.circleRadiusVirtualToScreen(gameObject.radius);

        // Draw in context
        this.context.save();
        this.context.beginPath();
        this.context.arc(resultingPosition.x, resultingPosition.y, scaledRadius, 0, 2 * Math.PI, false);
        this.context.fillStyle = gameObject.color.getRgba();
        this.context.fill();
        this.context.restore();
    }

    /**
     * Render sprite
     */
    private renderSprite(gameObject: GameObject): void {
        // In case game object is not the type we want to render
        if (!(gameObject instanceof SpriteObject)) {
            return;
        }

        // In case SpriteObject does not has any sprite assigned
        if (!gameObject.sprite) {
            console.warn(`SpriteObject ${gameObject.name} does not has any sprite assigned, it cannot be rendered!`);
            return;
        }

        // Calculate scaling
        const scaledPosition = this.scalingManager.virtualToScreen(gameObject.position);
        const scaledSize = this.scalingManager.boxSizeVirtualToScreen(new Vector2(gameObject.width, gameObject.height));
        const scaledCameraOffset = this.scalingManager.virtualToScreen(this.camera.getPositionOffsetForRenderer(gameObject));
        const resultingPosition = scaledPosition.subtract(scaledCameraOffset);

        // Set image smoothing (taken from the options)
        this.context.imageSmoothingEnabled = this.options.imageSmoothingEnabled;

        // Draw
        this.context.save();
        this.context.translate(resultingPosition.x, resultingPosition.y);
        this.context.rotate(gameObject.angle * Math.PI / 180);
        this.context.globalAlpha = gameObject.color.a;
        if (gameObject.shadow) {
            this.context.shadowBlur = gameObject.shadow.blurInPixels;
            this.context.shadowColor = gameObject.shadow.shadowColor.getRgba();
        }
        this.context.drawImage(
            gameObject.sprite.imageObject as unknown as CanvasImageSource,
            gameObject.sprite.positionInAtlasX,
            gameObject.sprite.positionInAtlasY,
            gameObject.sprite.spriteWidth,
            gameObject.sprite.spriteHeight,
            -scaledSize.x / 2,
            -scaledSize.y / 2,
            scaledSize.x,
            scaledSize.y
        );
        this.context.restore();
    }

    /**
     * Render text
     */
    private renderText(gameObject: GameObject): void {
        // In case game object is not the type we want to render
        if (!(gameObject instanceof TextObject)) {
            return;
        }

        // Calculate scaling
        const scaledPosition = this.scalingManager.virtualToScreen(gameObject.position);
        const cameraOffset = this.scalingManager.virtualToScreen(this.camera.getPositionOffsetForRenderer(gameObject));
        const resultingPosition = scaledPosition.subtract(cameraOffset);
        const scale = this.scalingManager.getScale();
        const uniformScaleFactor = Math.min(scale.x, scale.y);
        const scaledFontSize = gameObject.fontSize * uniformScaleFactor;

        // Draw in context with scaling applied
        this.context.save();
        this.context.fillStyle = gameObject.color.getRgba();
        this.context.font = `${scaledFontSize}px ${gameObject.fontName}`;
        this.context.textAlign = 'center'; // Align text to center horizontally
        this.context.textBaseline = 'middle'; // Align text to middle vertically

        // Draw the text at the scaled position
        this.context.fillText(gameObject.text, resultingPosition.x, resultingPosition.y);
        this.context.restore();
    }

    /**
     * Render line
     */
    private renderLine(gameObject: GameObject): void {
        // In case game object is not the type we want to render
        if (!(gameObject instanceof LineObject)) {
            return;
        }

        // Calculate scaling
        const scaledPosition = this.scalingManager.virtualToScreen(gameObject.position);
        const scaledEndPosition = this.scalingManager.virtualToScreen(gameObject.endPoint);
        const scaledSize = this.scalingManager.virtualToScreen(new Vector2(gameObject.lineWidth, gameObject.lineWidth));
        const scaledCameraOffset = this.scalingManager.virtualToScreen(this.camera.getPositionOffsetForRenderer(gameObject));
        const resultingPosition = scaledPosition.subtract(scaledCameraOffset);
        const endPositionWithOffset = scaledEndPosition.subtract(scaledCameraOffset);

        // Draw in context
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = gameObject.color.hex;
        this.context.lineWidth = scaledSize.x;
        this.context.lineCap = 'round';
        this.context.moveTo(resultingPosition.x, resultingPosition.y);
        this.context.lineTo(endPositionWithOffset.x, endPositionWithOffset.y);
        this.context.stroke();
        this.context.restore();
    }

    /**
     * Render collider
     */
    private renderCollider(gameObject: GameObject): void {
        // In case game object does not have any colliders
        if (!gameObject.collider) {
            return;
        }

        // Fill style of colliders
        const fillStyle = 'rgba(200, 50, 129, 0.6)';

        // Calculate scaling
        const scaledPosition = this.scalingManager.virtualToScreen(gameObject.position);
        const scaledCameraOffset = this.scalingManager.virtualToScreen(this.camera.getPositionOffsetForRenderer(gameObject));
        const resultingPosition = scaledPosition.subtract(scaledCameraOffset);

        // In case game object collider is a rect collider
        if (gameObject.collider instanceof RectCollider) {
            // Calculate scaled size
            const scaledSize = this.scalingManager.boxSizeVirtualToScreen(gameObject.collider.size);

            // Draw in context with scaling applied
            this.context.save();
            this.context.beginPath();
            this.context.fillStyle = fillStyle;
            this.context.fillRect(
                resultingPosition.x - scaledSize.x / 2,
                resultingPosition.y - scaledSize.y / 2,
                scaledSize.x,
                scaledSize.y
            );
            this.context.stroke();
            this.context.restore();
            return;
        }

        // In case game object collider is a circle collider
        if (gameObject.collider instanceof CircleCollider) {
            // Calculate scaled size
            const scaledRadius = this.scalingManager.circleRadiusVirtualToScreen(gameObject.collider.radius);

            // Draw in context with scaling applied
            this.context.save();
            this.context.beginPath();
            this.context.arc(
                resultingPosition.x,
                resultingPosition.y,
                scaledRadius,
                0,
                2 * Math.PI,
                false
            );
            this.context.fillStyle = fillStyle;
            this.context.fill();
            this.context.restore();
            return;
        }
    }

    /**
     * Render fps
     */
    private previousFps: number = 60;
    private fpsList: number[] = [];
    private renderFps(): void {
        // Draw in context
        this.context.save();
        this.context.fillStyle = 'rgba(0, 255, 0, 1)';
        this.context.font = '15px Nova Mono';
        this.context.fillText(`FPS: ${this.previousFps}`, 10, 20);
        this.context.restore();

        // Push fps to fps list
        let fps = Number((1 / Time.deltaTime).toFixed(0));
        fps = (isFinite(Number(fps)) ? fps : 60);
        this.fpsList.push(fps);

        // In case the fps list does not contains enough items
        if (this.fpsList.length < 5) {
            return;
        }

        // Set previous fps (calculate it)
        let fpsSum = 0;
        for (const element of this.fpsList) {
            fpsSum += element;
        }
        this.previousFps = Number((fpsSum / 5).toFixed(0));
        this.fpsList = [];
    }
}