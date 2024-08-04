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
exports.StatisticsRulesets = void 0;
var base_class_1 = require("./base.class");
var statistics_class_1 = require("./statistics.class");
var StatisticsRulesets = /** @class */ (function (_super) {
    __extends(StatisticsRulesets, _super);
    function StatisticsRulesets() {
        var _this = _super.call(this) || this;
        _this.osu = new statistics_class_1.Statistics();
        _this.taiko = new statistics_class_1.Statistics();
        _this.fruits = new statistics_class_1.Statistics();
        _this.mania = new statistics_class_1.Statistics();
        return _this;
    }
    return StatisticsRulesets;
}(base_class_1.ClassModel));
exports.StatisticsRulesets = StatisticsRulesets;
