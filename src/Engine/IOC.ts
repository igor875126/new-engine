import IOCMakeException from "../Exceptions/IOCMakeException";

export default class IOC {

    public static singletonInstances: { instanceName: string, instance: any }[] = [];

    /**
     * Register singleton
     */
    public static registerSingleton(instanceName: string, instance: any): void {
        IOC.singletonInstances.push({
            instanceName,
            instance,
        });
    }

    /**
     * Get singleton
     */
    public static makeSingleton<T>(instanceName: string): any {
        // Iterate through singleton instances and try to find already instantiated one
        // If found return it
        for (const element of IOC.singletonInstances) {
            if (element.instanceName === instanceName && element.instance !== null) {
                return element.instance;
            }
        }

        // Nope requested name does not exists in ioc.ts config
        throw new IOCMakeException(`Requested instance (${instanceName}) not found in IOC container, maybe you forgot to register it?`);
    }
}