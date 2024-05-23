import { GradeCounts } from "./grade_counts.class.js";
import { Level } from "./level.class.js";
import { Rank } from "./rank.class.js";

export class Statistics {
  public count_100: number = 0;
  public count_300: number = 0;
  public count_50: number = 0;
  public count_miss: number = 0;
  public country_rank: number = 0;
  public global_rank: number = 0;
  public global_rank_exp: null = null;
  public grade_counts: GradeCounts = new GradeCounts();
  public hit_accuracy: number = 0.0;
  public is_ranked: boolean = true;
  public level: Level = new Level();
  public maximum_combo: number = 0;
  public play_count: number = 0;
  public play_time: number = 0;
  public pp: number = 0.0;
  public pp_exp: number = 0;
  public rank: Rank = new Rank();
  public ranked_score: number = 0;
  public replays_watched_by_others: number = 0;
  public total_hits: number = 0;
  public total_score: number = 0;

  constructor() {}

  getCount100(): number {
    return this.count_100;
  }

  getCount300(): number {
    return this.count_300;
  }

  getCount50(): number {
    return this.count_50;
  }

  getCountMiss(): number {
    return this.count_miss;
  }

  getCountryRank(): number {
    return this.country_rank;
  }

  getGlobalRank(): number {
    return this.global_rank;
  }

  getGlobalRankExp(): null {
    return this.global_rank_exp;
  }

  getGradeCounts(): GradeCounts {
    return this.grade_counts;
  }

  getHitAccuracy(): number {
    return this.hit_accuracy;
  }

  getIsRanked(): boolean {
    return this.is_ranked;
  }

  getLevel(): Level {
    return this.level;
  }

  getMaximumCombo(): number {
    return this.maximum_combo;
  }

  getPlayCount(): number {
    return this.play_count;
  }

  getPlayTime(): number {
    return this.play_time;
  }

  getPP(): number {
    return this.pp;
  }

  getPPExp(): number {
    return this.pp_exp;
  }

  getRank(): Rank {
    return this.rank;
  }

  getRankedScore(): number {
    return this.ranked_score;
  }

  getReplaysWatchedByOthers(): number {
    return this.replays_watched_by_others;
  }

  getTotalHits(): number {
    return this.total_hits;
  }

  getTotalScore(): number {
    return this.total_score;
  }

  setCount100(count: number): void {
    this.count_100 = count;
  }

  setCount300(count: number): void {
    this.count_300 = count;
  }

  setCount50(count: number): void {
    this.count_50 = count;
  }

  setCountMiss(count: number): void {
    this.count_miss = count;
  }

  setCountryRank(rank: number): void {
    this.country_rank = rank;
  }

  setGlobalRank(rank: number): void {
    this.global_rank = rank;
  }

  setGlobalRankExp(exp: null): void {
    this.global_rank_exp = exp;
  }

  setGradeCounts(gradeCounts: GradeCounts): void {
    this.grade_counts = gradeCounts;
  }

  setHitAccuracy(accuracy: number): void {
    this.hit_accuracy = accuracy;
  }

  setIsRanked(isRanked: boolean): void {
    this.is_ranked = isRanked;
  }

  setLevel(level: Level): void {
    this.level = level;
  }

  setMaximumCombo(combo: number): void {
    this.maximum_combo = combo;
  }

  setPlayCount(count: number): void {
    this.play_count = count;
  }

  setPlayTime(time: number): void {
    this.play_time = time;
  }

  setPP(pp: number): void {
    this.pp = pp;
  }

  setPPExp(exp: number): void {
    this.pp_exp = exp;
  }

  setRank(rank: Rank): void {
    this.rank = rank;
  }

  setRankedScore(score: number): void {
    this.ranked_score = score;
  }

  setReplaysWatchedByOthers(count: number): void {
    this.replays_watched_by_others = count;
  }

  setTotalHits(hits: number): void {
    this.total_hits = hits;
  }

  setTotalScore(score: number): void {
    this.total_score = score;
  }

  getObject(): {
    count_100: number;
    count_300: number;
    count_50: number;
    count_miss: number;
    country_rank: number;
    global_rank: number;
    global_rank_exp: null;
    grade_counts: Object;
    hit_accuracy: number;
    is_ranked: boolean;
    level: Object;
    maximum_combo: number;
    play_count: number;
    play_time: number;
    pp: number;
    pp_exp: number;
    rank: Object;
    ranked_score: number;
    replays_watched_by_others: number;
    total_hits: number;
    total_score: number;
  } {
    return {
      count_100: this.count_100,
      count_300: this.count_300,
      count_50: this.count_50,
      count_miss: this.count_miss,
      country_rank: this.country_rank,
      global_rank: this.global_rank,
      global_rank_exp: this.global_rank_exp,
      grade_counts: this.grade_counts.getObject(),
      hit_accuracy: this.hit_accuracy,
      is_ranked: this.is_ranked,
      level: this.level.getObject(),
      maximum_combo: this.maximum_combo,
      play_count: this.play_count,
      play_time: this.play_time,
      pp: this.pp,
      pp_exp: this.pp_exp,
      rank: this.rank.getObject(),
      ranked_score: this.ranked_score,
      replays_watched_by_others: this.replays_watched_by_others,
      total_hits: this.total_hits,
      total_score: this.total_score,
    };
  }
}
