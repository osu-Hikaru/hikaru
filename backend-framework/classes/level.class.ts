import {ClassModel} from "./base.class.js";

export class Level extends ClassModel {
    public current: number = 0;
    public progress: number = 0;

    constructor() {
        super();
    }

    getCurrent(): number {
        return this.current;
    }

    getProgress(): number {
        return this.progress;
    }

    setCurrent(current: number): void {
        this.current = current;
    }

    setProgress(progress: number): void {
        this.progress = progress;
    }
}
