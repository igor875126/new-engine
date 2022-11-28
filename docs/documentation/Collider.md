# Collider
Each `GameObject` should have a property inherited from parent which calls `Collider`. The collider property must exist, but can be `null`.

Possible colliders:

- `RectCollider(size: Vector2, offset: Vector2)`
- `CircleCollider(radius: number, offset: Vector2)`
- `null`

> Only if `GameObject` has any collider attached to it, it can interact with `User Input` or other objects. E.g. `onMouseClick()` method will only work if `GameObject` has a collider.

## Example
Create a `SpriteObject`, e.g. Player.
```typescript
import Sprite from "new-engine/build/Engine/Sprite";
import Vector2 from "new-engine/build/Engine/Vector2";
import SpriteObject from "new-engine/build/Objects/SpriteObject";

export default class Player extends SpriteObject {
    public position: Vector2 = new Vector2(150, 200);
    public width: number = 50;
    public height: number = 50;
    public angle: number = 0;
    public sprite: Sprite = new Sprite('doodle', 232, 0, 232, 256);
    public collider: CircleCollider(50, new Vector2(0, 0));
}
```