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
exports.RankHistory = void 0;
var base_class_1 = require("./base.class");
var RankHistory = /** @class */ (function (_super) {
    __extends(RankHistory, _super);
    function RankHistory() {
        var _this = _super.call(this) || this;
        _this.data = [];
        _this.mode = "";
        return _this;
    }
    RankHistory.prototype.getData = function () {
        return this.data;
    };
    RankHistory.prototype.getMode = function () {
        return this.mode;
    };
    RankHistory.prototype.setData = function (data) {
        this.data = data;
    };
    RankHistory.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    return RankHistory;
}(base_class_1.ClassModel));
exports.RankHistory = RankHistory;
