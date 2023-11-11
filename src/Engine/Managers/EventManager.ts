import GameObject from "../../Entities/Primitives/GameObject";

/**
 * The EventManager class is designed to facilitate event handling and communication between game objects in a game.
 * It provides a structured way to register event listeners, dispatch events,
 * and manage callbacks associated with specific events.
 */
export default class EventManager {

    public eventListeners: { [key: string]: { gameObject: GameObject, callback: (data: any) => void }[] } = {};

    /**
     * Remove event listener by game object
     */
    public removeEventListenerByGameObject(gameObject: GameObject): void {
        for (const [eventName, value] of Object.entries(this.eventListeners)) {
            for (let i = 0; i < value.length; i++) {
                if (this.eventListeners[eventName][i].gameObject.name === gameObject.name) {
                    // Destroy from array
                    this.eventListeners[eventName].splice(i, 1);
                }
            }
        }
    }

    /**
     * Listen for event
     */
    public listenForEvent(gameObject: GameObject, eventName: string, callback: (data: any) => void): void {
        // First of all check if event exists in class property eventListeners
        if (this.eventListeners[eventName]) {
            // In that case push to array the callback
            this.eventListeners[eventName].push({
                gameObject,
                callback
            });
        } else {
            // Otherwise there is no listeners, create
            this.eventListeners[eventName] = [{
                gameObject,
                callback
            }];
        }
    }

    /**
     * Dispatch event
     */
    public dispatchEvent(eventName: string, data: any): void {
        // Get event listeners by event name eventListeners property
        const eventListeners = this.eventListeners[eventName];

        // In case event was not found (not in the list)
        if (!eventListeners) {
            // In case there are no listeners, just do nothing...
            return;
        }

        // Call callback function of event
        for (const eventListener of eventListeners) {
            eventListener.callback(data);
        }
    }
}