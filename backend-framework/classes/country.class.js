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
exports.Country = void 0;
var base_class_1 = require("./base.class");
var Country = /** @class */ (function (_super) {
    __extends(Country, _super);
    function Country() {
        var _this = _super.call(this) || this;
        _this.countryName = "";
        _this.countryCode = "";
        return _this;
    }
    Country.prototype.getCountryName = function () {
        return this.countryName;
    };
    Country.prototype.getCountryCode = function () {
        return this.countryCode;
    };
    Country.prototype.setCountryName = function (countryName) {
        this.countryName = countryName;
    };
    Country.prototype.setCountryCode = function (countryCode) {
        this.countryCode = countryCode;
    };
    return Country;
}(base_class_1.ClassModel));
exports.Country = Country;
