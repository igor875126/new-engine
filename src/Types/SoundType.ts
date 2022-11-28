export default interface ImageType {
    name: string;
    url: string;
    object: {
        audioBufferSourceNode: AudioBufferSourceNode;
        currentPlaying: {
            audioBufferSourceNode: AudioBufferSourceNode;
            gainNode: GainNode
        } | null;
    } | null;
    loaded: boolean;
}