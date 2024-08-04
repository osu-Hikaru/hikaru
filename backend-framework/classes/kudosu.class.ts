import {ClassModel} from "./base.class.js";

export class Kudosu extends ClassModel {
    private available: number = 0;
    private total: number = 0;

    constructor() {
        super();
    }

    getAvailable(): number {
        return this.available;
    }

    getTotal(): number {
        return this.total;
    }

    setAvailable(available: number): void {
        this.available = available;
    }

    setTotal(total: number): void {
        this.total = total;
    }
}
