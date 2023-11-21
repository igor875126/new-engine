import Vector2 from "../Engine/Utilities/Vector2";

export default interface CoreOptionsType {
    // Game language
    language: string;

    // According to this environment the keys '1' and '2' (debug keys) etc... are enabled or disabled
    environment: 'production' | 'development';

    // Debug options
    debug: {
        toggleFpsRenderingAtStart: boolean;
        toggleDebugColliderRenderingAtStart: boolean;
    };

    // Renderer options
    rendererOptions: {
        resolution: Vector2;
        imageSmoothingEnabled: boolean;
    };

    // Collisions options
    collisions: {
        enabled: boolean;
        fixedLoopWaitInMs: number;
    };
}