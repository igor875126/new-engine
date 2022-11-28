import ResourceLoader from "./ResourceLoader";

export default class Locale {

    private resourceLoader: ResourceLoader;
    private selectedLanguage: string = 'ru';

    /**
     * Constructor
     */
    constructor(resourceLoader: ResourceLoader, language: string) {
        this.resourceLoader = resourceLoader;
        this.setLanguage(language);
    }

    /**
     * Set language
     */
    public setLanguage(language: string): void {
        this.selectedLanguage = language;
    }

    /**
     * Get translation
     */
    public get(localeName: string, key: string): any {
        // Get locale
        const locale = this.resourceLoader.getLocaleByName(localeName);

        // Get it's payload
        const locales = locale.locales!;

        // In case translations is not found
        if (!locales[key] || !locales[key][this.selectedLanguage]) {
            return `${localeName}.${key}`;
        }

        // Return
        return locales[key][this.selectedLanguage];
    }
}