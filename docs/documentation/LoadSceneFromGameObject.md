# Load scene from GameObject
You can load a scene from game object or some else place in your game.

## Example
Create a `SpriteObject`, e.g. Player.

```typescript
import IOC from "new-engine/build/Engine/IOC";
import Sprite from "new-engine/build/Engine/Sprite";
import Input from "new-engine/build/Engine/Input";
import Vector2 from "new-engine/build/Engine/Vector2";
import SpriteObject from "new-engine/build/Objects/SpriteObject";
import Core from "new-engine/build/Engine/Core";
import Color from "new-engine/build/Engine/Color";
import RectCollider from "new-engine/build/Engine/RectCollider";
import CircleCollider from "new-engine/build/Engine/CircleCollider";

export default class Player extends SpriteObject {
    public width: number = 107;
    public height: number = 48;
    public angle: number = 0;
    public sprite: Sprite | null = new Sprite('doodle', 0, 0, 430, 195);
    public position: Vector2 = new Vector2(250, 250);
    public collider: RectCollider | CircleCollider | null = null;
    public color: Color = new Color(255, 255, 255, 0);
    private core: Core;

    /**
     * Constructor
     */
    constructor() {
        super();
        this.core = IOC.makeSingleton('Core');

        // Load a scene
        this.core.loadSceneAndRun('scene1');
    }
}
```