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
exports.GradeCounts = void 0;
var base_class_1 = require("./base.class");
var GradeCounts = /** @class */ (function (_super) {
    __extends(GradeCounts, _super);
    function GradeCounts() {
        var _this = _super.call(this) || this;
        _this.a = 0;
        _this.s = 0;
        _this.sh = 0;
        _this.ss = 0;
        _this.ssh = 0;
        return _this;
    }
    GradeCounts.prototype.getA = function () {
        return this.a;
    };
    GradeCounts.prototype.getS = function () {
        return this.s;
    };
    GradeCounts.prototype.getSh = function () {
        return this.sh;
    };
    GradeCounts.prototype.getSs = function () {
        return this.ss;
    };
    GradeCounts.prototype.getSsh = function () {
        return this.ssh;
    };
    GradeCounts.prototype.setA = function (a) {
        this.a = a;
    };
    GradeCounts.prototype.setS = function (s) {
        this.s = s;
    };
    GradeCounts.prototype.setSh = function (sh) {
        this.sh = sh;
    };
    GradeCounts.prototype.setSs = function (ss) {
        this.ss = ss;
    };
    GradeCounts.prototype.setSsh = function (ssh) {
        this.ssh = ssh;
    };
    return GradeCounts;
}(base_class_1.ClassModel));
exports.GradeCounts = GradeCounts;
