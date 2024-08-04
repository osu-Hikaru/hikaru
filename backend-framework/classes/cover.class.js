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
exports.Cover = void 0;
var base_class_1 = require("./base.class");
var Cover = /** @class */ (function (_super) {
    __extends(Cover, _super);
    function Cover() {
        var _this = _super.call(this) || this;
        _this.custom_url = "";
        _this.id = null;
        _this.url = "";
        return _this;
    }
    Cover.prototype.getCustomUrl = function () {
        return this.custom_url;
    };
    Cover.prototype.setCustomUrl = function (url) {
        this.custom_url = url;
    };
    Cover.prototype.getId = function () {
        return this.id;
    };
    Cover.prototype.setId = function (id) {
        this.id = id;
    };
    Cover.prototype.getUrl = function () {
        return this.url;
    };
    Cover.prototype.setUrl = function (url) {
        this.url = url;
    };
    return Cover;
}(base_class_1.ClassModel));
exports.Cover = Cover;
