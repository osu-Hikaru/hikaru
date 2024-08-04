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
exports.Kudosu = void 0;
var base_class_1 = require("./base.class");
var Kudosu = /** @class */ (function (_super) {
    __extends(Kudosu, _super);
    function Kudosu() {
        var _this = _super.call(this) || this;
        _this.available = 0;
        _this.total = 0;
        return _this;
    }
    Kudosu.prototype.getAvailable = function () {
        return this.available;
    };
    Kudosu.prototype.getTotal = function () {
        return this.total;
    };
    Kudosu.prototype.setAvailable = function (available) {
        this.available = available;
    };
    Kudosu.prototype.setTotal = function (total) {
        this.total = total;
    };
    return Kudosu;
}(base_class_1.ClassModel));
exports.Kudosu = Kudosu;
