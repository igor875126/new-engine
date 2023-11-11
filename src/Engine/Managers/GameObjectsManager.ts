import GameObject from "../../Entities/Primitives/GameObject";
import EventManager from "./EventManager";

/**
 * The GameObjectsManager class serves as a central entity for managing game objects in a game or application.
 * It is responsible for creating, tracking, and controlling the lifecycle of game objects. Additionally,
 * it provides methods to access and manipulate game objects efficiently.
 */
export default class GameObjectsManager {

    private eventManager: EventManager;
    private gameObjects: GameObject[] = [];
    private listOfGameObjectsWhereStartShouldBeCalled: GameObject[] = [];

    /**
     * Constructor
     */
    constructor(eventManager: EventManager) {
        this.eventManager = eventManager;
    }

    /**
     * Instantiate gameObject (create)
     */
    public instantiate(gameObject: GameObject): GameObject {
        // Push to game objects array
        this.gameObjects.push(gameObject);

        // Push to list of game objects where start should be called
        this.listOfGameObjectsWhereStartShouldBeCalled.push(gameObject);

        // Return itself
        return gameObject;
    }

    /**
     * Destroy gameObject (delete)
     */
    public destroy(gameObject: GameObject): GameObject | null {
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].name === gameObject.name) {
                // Make a copy of the object which should be removed
                const copy = this.gameObjects[i];

                // Destroy from array
                this.gameObjects.splice(i, 1);

                // Remove all event listeners
                this.eventManager.removeEventListenerByGameObject(gameObject);

                // Return deleted object, in case this is needed
                return copy;
            }
        }

        return null;
    }

    /**
     * Destroy all gameObjects
     */
    public destroyAll(): void {
        this.gameObjects = [];
    }

    /**
     * Get all gameObjects
     */
    public getAll(): GameObject[] {
        // Sort gameObjects by renderingLayer desc
        this.gameObjects = this.gameObjects.sort((a, b) => (a.renderingLayer < b.renderingLayer) ? 1 : -1);

        // Return
        return this.gameObjects;
    }

    /**
     * Get gameObject by name
     */
    public getByName(name: string): GameObject | null {
        for (const gameObject of this.gameObjects) {
            if (gameObject.name === name) {
                return gameObject;
            }
        }

        return null;
    }

    /**
     * Call start method of instantiated game objects
     */
    public callStartMethodOfInstantiatedGameObjects(): void {
        for (const gameObject of this.listOfGameObjectsWhereStartShouldBeCalled) {
            gameObject.start();
        }
        this.listOfGameObjectsWhereStartShouldBeCalled = [];
    }
}