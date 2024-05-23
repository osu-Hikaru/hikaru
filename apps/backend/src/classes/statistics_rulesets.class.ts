import { Statistics } from "./statistics.class.js";

export class StatisticsRuleset {
  public name: string = "";
  public statistics: Statistics = new Statistics();

  constructor() {}

  getName(): string {
    return this.name;
  }

  getStatistics(): Statistics {
    return this.statistics;
  }

  setName(name: string): void {
    this.name = name;
  }

  setStatistics(statistics: Statistics): void {
    this.statistics = statistics;
  }

  getObject(): {
    [key: string]: { statistics: Statistics };
  } {
    return {
      [this.name]: {
        statistics: this.statistics,
      },
    };
  }
}

export class StatisticsRulesets extends StatisticsRuleset {
  public rulesets: { [key: string]: { statistics: Statistics } } = {};

  constructor() {
    super();
  }

  getRulesets(): { [key: string]: { statistics: Statistics } } {
    return this.rulesets;
  }

  setRulesets(rulesets: { [key: string]: { statistics: Statistics } }): void {
    this.rulesets = rulesets;
  }

  getObject(): {
    [key: string]: { statistics: Statistics };
  } {
    return this.rulesets;
  }
}
