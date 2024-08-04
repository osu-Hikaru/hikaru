"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statistics = void 0;
var base_class_1 = require("./base.class");
var grade_counts_class_1 = require("./grade_counts.class");
var level_class_1 = require("./level.class");
var rank_class_1 = require("./rank.class");
var Statistics = /** @class */ (function (_super) {
    __extends(Statistics, _super);
    function Statistics() {
        var _this = _super.call(this) || this;
        _this.count_100 = 0;
        _this.count_300 = 0;
        _this.count_50 = 0;
        _this.count_miss = 0;
        _this.country_rank = 0;
        _this.global_rank = 0;
        _this.global_rank_exp = null;
        _this.grade_counts = new grade_counts_class_1.GradeCounts();
        _this.hit_accuracy = 0.0;
        _this.is_ranked = true;
        _this.level = new level_class_1.Level();
        _this.maximum_combo = 0;
        _this.play_count = 0;
        _this.play_time = 0;
        _this.pp = 0.0;
        _this.pp_exp = 0;
        _this.rank = new rank_class_1.Rank();
        _this.ranked_score = 0;
        _this.replays_watched_by_others = 0;
        _this.total_hits = 0;
        _this.total_score = 0;
        return _this;
    }
    Statistics.prototype.getCount100 = function () {
        return this.count_100;
    };
    Statistics.prototype.getCount300 = function () {
        return this.count_300;
    };
    Statistics.prototype.getCount50 = function () {
        return this.count_50;
    };
    Statistics.prototype.getCountMiss = function () {
        return this.count_miss;
    };
    Statistics.prototype.getCountryRank = function () {
        return this.country_rank;
    };
    Statistics.prototype.getGlobalRank = function () {
        return this.global_rank;
    };
    Statistics.prototype.getGlobalRankExp = function () {
        return this.global_rank_exp;
    };
    Statistics.prototype.getGradeCounts = function () {
        return this.grade_counts;
    };
    Statistics.prototype.getHitAccuracy = function () {
        return this.hit_accuracy;
    };
    Statistics.prototype.getIsRanked = function () {
        return this.is_ranked;
    };
    Statistics.prototype.getLevel = function () {
        return this.level;
    };
    Statistics.prototype.getMaximumCombo = function () {
        return this.maximum_combo;
    };
    Statistics.prototype.getPlayCount = function () {
        return this.play_count;
    };
    Statistics.prototype.getPlayTime = function () {
        return this.play_time;
    };
    Statistics.prototype.getPP = function () {
        return this.pp;
    };
    Statistics.prototype.getPPExp = function () {
        return this.pp_exp;
    };
    Statistics.prototype.getRank = function () {
        return this.rank;
    };
    Statistics.prototype.getRankedScore = function () {
        return this.ranked_score;
    };
    Statistics.prototype.getReplaysWatchedByOthers = function () {
        return this.replays_watched_by_others;
    };
    Statistics.prototype.getTotalHits = function () {
        return this.total_hits;
    };
    Statistics.prototype.getTotalScore = function () {
        return this.total_score;
    };
    Statistics.prototype.setCount100 = function (count) {
        this.count_100 = count;
    };
    Statistics.prototype.setCount300 = function (count) {
        this.count_300 = count;
    };
    Statistics.prototype.setCount50 = function (count) {
        this.count_50 = count;
    };
    Statistics.prototype.setCountMiss = function (count) {
        this.count_miss = count;
    };
    Statistics.prototype.setCountryRank = function (rank) {
        this.country_rank = rank;
    };
    Statistics.prototype.setGlobalRank = function (rank) {
        this.global_rank = rank;
    };
    Statistics.prototype.setGlobalRankExp = function (exp) {
        this.global_rank_exp = exp;
    };
    Statistics.prototype.setGradeCounts = function (gradeCounts) {
        this.grade_counts = gradeCounts;
    };
    Statistics.prototype.setHitAccuracy = function (accuracy) {
        this.hit_accuracy = accuracy;
    };
    Statistics.prototype.setIsRanked = function (isRanked) {
        this.is_ranked = isRanked;
    };
    Statistics.prototype.setLevel = function (level) {
        this.level = level;
    };
    Statistics.prototype.setMaximumCombo = function (combo) {
        this.maximum_combo = combo;
    };
    Statistics.prototype.setPlayCount = function (count) {
        this.play_count = count;
    };
    Statistics.prototype.setPlayTime = function (time) {
        this.play_time = time;
    };
    Statistics.prototype.setPP = function (pp) {
        this.pp = pp;
    };
    Statistics.prototype.setPPExp = function (exp) {
        this.pp_exp = exp;
    };
    Statistics.prototype.setRank = function (rank) {
        this.rank = rank;
    };
    Statistics.prototype.setRankedScore = function (score) {
        this.ranked_score = score;
    };
    Statistics.prototype.setReplaysWatchedByOthers = function (count) {
        this.replays_watched_by_others = count;
    };
    Statistics.prototype.setTotalHits = function (hits) {
        this.total_hits = hits;
    };
    Statistics.prototype.setTotalScore = function (score) {
        this.total_score = score;
    };
    return Statistics;
}(base_class_1.ClassModel));
exports.Statistics = Statistics;
