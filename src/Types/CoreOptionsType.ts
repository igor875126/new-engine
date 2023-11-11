import Vector2 from "../Engine/Utilities/Vector2";

export default interface CoreOptionsType {
    resolution: Vector2;
    language: string;
    environment: 'production' | 'development';
    debug: {
        toggleFpsRenderingAtStart: boolean;
        toggleDebugColliderRenderingAtStart: boolean;
    };
    rendererOptions: {
        imageSmoothingEnabled: boolean;
    };
}