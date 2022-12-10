export default interface CoreOptionsType {
    language: string;
    environment: 'production' | 'development';
    rendererOptions: {
        imageSmoothingEnabled: boolean;
    };
}