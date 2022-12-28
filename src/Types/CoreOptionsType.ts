export default interface CoreOptionsType {
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