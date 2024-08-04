import {ClassModel} from "./base.class.js";

import {Statistics} from "./statistics.class.js";

export class StatisticsRulesets extends ClassModel {
    private osu: Statistics = new Statistics();
    private taiko: Statistics = new Statistics();
    private fruits: Statistics = new Statistics();
    private mania: Statistics = new Statistics();

    constructor() {
        super();
    }
}