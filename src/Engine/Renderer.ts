import CircleObject from "../Objects/CircleObject";
import GameObject from "../Objects/GameObject";
import LineObject from "../Objects/LineObject";
import RectObject from "../Objects/RectObject";
import SpriteObject from "../Objects/SpriteObject";
import TextObject from "../Objects/TextObject";
import CoreOptionsType from "../Types/CoreOptionsType";
import Camera from "./Camera";
import CircleCollider from "./CircleCollider";
import RectCollider from "./RectCollider";
import Time from "./Time";

export default class Renderer {

    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public camera: Camera;
    public options: CoreOptionsType['rendererOptions'];
    private renderQueue: GameObject[] = [];
    private debug: { colliderRenderingEnabled: boolean, fpsRenderingEnabled: boolean } = {
        colliderRenderingEnabled: false,
        fpsRenderingEnabled: false,
    };

    /**
     * Constructor
     */
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, camera: Camera, options: CoreOptionsType['rendererOptions']) {
        this.canvas = canvas;
        this.context = context;
        this.camera = camera;
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

        // Draw in context
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = gameObject.color.getRgba();
        this.context.fillRect(gameObject.position.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y - this.camera.getPositionOffsetForRenderer(gameObject).y, gameObject.width, gameObject.height);
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

        // Draw in context
        this.context.save();
        this.context.beginPath();
        this.context.arc(gameObject.position.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y - this.camera.getPositionOffsetForRenderer(gameObject).y, gameObject.radius, 0, 2 * Math.PI, false);
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

        // Set image smoothing (taken from the options)
        this.context.imageSmoothingEnabled = this.options.imageSmoothingEnabled;

        // Draw
        this.context.save();
        this.context.translate(gameObject.position.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y - this.camera.getPositionOffsetForRenderer(gameObject).y);
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
            -gameObject.width / 2,
            -gameObject.height / 2,
            gameObject.width,
            gameObject.height
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

        // Get text dimensions
        const textDimensions = gameObject.getTextDimensions();

        // Draw in context
        this.context.save();
        this.context.fillStyle = gameObject.color.getRgba();
        this.context.font = `${gameObject.fontSize}px ${gameObject.fontName}`;
        this.context.textBaseline = 'top';
        this.context.fillText(gameObject.text, gameObject.position.x - textDimensions.width / 2 - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y - 1 - textDimensions.height / 2 - this.camera.getPositionOffsetForRenderer(gameObject).y);
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

        // Draw in context
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = gameObject.color.hex;
        this.context.lineWidth = gameObject.lineWidth;
        this.context.lineCap = 'round';
        this.context.moveTo(gameObject.position.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.position.y - this.camera.getPositionOffsetForRenderer(gameObject).y);
        this.context.lineTo(gameObject.endPoint.x - this.camera.getPositionOffsetForRenderer(gameObject).x, gameObject.endPoint.y - this.camera.getPositionOffsetForRenderer(gameObject).y);
        this.context.stroke();
        this.context.restore();
    }

    /**
     * Render collider
     */
    private renderCollider(gameObject: GameObject): void {
        // In case game object does not has any colliders
        if (!gameObject.collider) {
            return;
        }

        // Fill style of colliders
        const fillStyle = 'rgba(200, 50, 129, 0.6)';

        // In case game object collider is a rect collider
        if (gameObject.collider instanceof RectCollider) {
            // Draw in context
            this.context.save();
            this.context.beginPath();
            this.context.fillStyle = fillStyle;
            this.context.fillRect(
                gameObject.position.x + gameObject.collider.offset.x - this.camera.getPositionOffsetForRenderer(gameObject).x,
                gameObject.position.y + gameObject.collider.offset.y - this.camera.getPositionOffsetForRenderer(gameObject).y,
                gameObject.collider.size.x,
                gameObject.collider.size.y
            );
            this.context.stroke();
            this.context.restore();
            return;
        }

        // In case game object collider is a circle collider
        if (gameObject.collider instanceof CircleCollider) {
            // Draw in context
            this.context.save();
            this.context.beginPath();
            this.context.arc(
                gameObject.position.x + gameObject.collider.offset.x - this.camera.getPositionOffsetForRenderer(gameObject).x,
                gameObject.position.y + gameObject.collider.offset.y - this.camera.getPositionOffsetForRenderer(gameObject).y,
                gameObject.collider.radius,
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