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
exports.Level = void 0;
var base_class_1 = require("./base.class");
var Level = /** @class */ (function (_super) {
    __extends(Level, _super);
    function Level() {
        var _this = _super.call(this) || this;
        _this.current = 0;
        _this.progress = 0;
        return _this;
    }
    Level.prototype.getCurrent = function () {
        return this.current;
    };
    Level.prototype.getProgress = function () {
        return this.progress;
    };
    Level.prototype.setCurrent = function (current) {
        this.current = current;
    };
    Level.prototype.setProgress = function (progress) {
        this.progress = progress;
    };
    return Level;
}(base_class_1.ClassModel));
exports.Level = Level;
