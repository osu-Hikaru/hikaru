export class ClassModel {
    constructor() {
    }

    protected package<T extends ClassModel>(instance: T): string {
        const returnObject: Record<string, any> = {};

        Object.entries(instance).forEach(([key, value]) => {
            if (key.startsWith("_")) {
                return;
            } else if (value instanceof ClassModel) {
                returnObject[key] = JSON.parse(value.package(value));
            } else {
                returnObject[key] = value;
                return;
            }
        });

        return JSON.stringify(returnObject);
    }
}