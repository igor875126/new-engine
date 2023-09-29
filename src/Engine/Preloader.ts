export default class Preloader {
    /**
     * Show preloader
     */
    public static showPreloader(): void {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'block';
        }
    }

    /**
     * Hide preloader
     */
    public static hidePreloader(): void {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
    }

    /**
     * Set preloader progress in percent
     */
    public static setPreloaderProgressInPercent(percentage: number): void {
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        const loadingText = document.getElementById('preloader-loading-percentage');
        const fillBar = document.getElementById('preloader-progress-bar-fill');
        if (loadingText && fillBar) {
            loadingText.innerText = `${percentage}%`;
            fillBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Set preloader progress
     */
    public static setPreloaderProgress(loadedResources: number, totalResources: number): void {
        // Calculate percentage
        const percentage = Math.floor(loadedResources * 100 / totalResources);

        // Set preloader progress
        Preloader.setPreloaderProgressInPercent(percentage);
    }
}