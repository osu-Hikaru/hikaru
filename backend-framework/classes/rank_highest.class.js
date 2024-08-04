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
exports.RankHighest = void 0;
var base_class_1 = require("./base.class");
var RankHighest = /** @class */ (function (_super) {
    __extends(RankHighest, _super);
    function RankHighest() {
        var _this = _super.call(this) || this;
        _this.rank = 0;
        _this.updated_at = new Date();
        return _this;
    }
    RankHighest.prototype.getRank = function () {
        return this.rank;
    };
    RankHighest.prototype.getUpdatedAt = function () {
        return this.updated_at;
    };
    RankHighest.prototype.setRank = function (rank) {
        this.rank = rank;
    };
    RankHighest.prototype.setUpdatedAt = function (updated_at) {
        this.updated_at = updated_at;
    };
    return RankHighest;
}(base_class_1.ClassModel));
exports.RankHighest = RankHighest;
