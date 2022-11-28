# Animator
Animator is a class which helps to animate sprites. It works only with `SpriteObject`.
Animator just changes the `this.sprite` with time, `Renderer` just renders the current sprite.

## Example
Create a `SpriteObject`, e.g. Player.
```typescript
import Sprite from "new-engine/build/Engine/Sprite";
import Vector2 from "new-engine/build/Engine/Vector2";
import SpriteObject from "new-engine/build/Objects/SpriteObject";
import Animator from "new-engine/build/Engine/Animator";

export default class Player extends SpriteObject {

    public position: Vector2 = new Vector2(150, 200);
    public width: number = 50;
    public height: number = 50;
    public angle: number = 0;
    public sprite: Sprite = new Sprite('doodle', 232, 0, 232, 256);
    private animator: Animator;

    /**
     * Constructor
     */
    constructor() {
        super();
        this.animator = new Animator();
        this.animator.addFrame('idle', this.leftSprite);
        this.animator.addFrame('idle', this.rightSprite);
        this.animator.play('idle', 150);
    }

    /**
     * Called every frame
     */
    public update(): void {
        // It will change the sprite with time, which is assigned to this.sprite
        // Engine Renderer will take current this.sprite and renders it
        this.sprite = this.animator.getSpriteForDrawing();
    }
}
```