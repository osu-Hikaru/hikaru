import { DatabaseModel } from "../models/model.js";

import { Statistics } from "./statistics.class.js";

export class StatisticsRulesets extends DatabaseModel {
    private osu: Statistics = new Statistics();
    private taiko: Statistics = new Statistics();
    private fruits: Statistics = new Statistics();
    private mania: Statistics = new Statistics();
    
    constructor() {
        super();
    }
}