import ResourceLoader from "../Core/ResourceLoader";

/**
 * The Locale class is designed to manage localization and provide a mechanism for retrieving translated text
 * or content for different languages within an application or game.
 * It relies on a ResourceLoader to load and access localized data.
 */
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