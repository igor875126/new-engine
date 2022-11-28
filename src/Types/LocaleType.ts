export default interface ImageType {
    name: string;
    url: string;
    locales?: { [key: string]: string };
    loaded: boolean;
}