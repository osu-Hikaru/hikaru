import {ClassModel} from "./base.class.js";

export class Group extends ClassModel {
    colour: string = "";
    has_listing: boolean = true;
    has_playmodes: boolean = false;
    id: number = 0;
    identifier: string = "";
    is_probationary: boolean = false;
    name: string = "";
    playmodes: string[] | null = null;
    short_name: string = "";

    constructor() {
        super();
    }

    getObject() {
        return this.package(this);
    }
}
