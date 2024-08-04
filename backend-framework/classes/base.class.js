"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassModel = void 0;
var ClassModel = /** @class */ (function () {
    function ClassModel() {
    }
    ClassModel.prototype.package = function (instance) {
        var returnObject = {};
        Object.entries(instance).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (key.startsWith("_")) {
                return;
            }
            else if (value instanceof ClassModel) {
                returnObject[key] = JSON.parse(value.package(value));
            }
            else {
                returnObject[key] = value;
                return;
            }
        });
        return JSON.stringify(returnObject);
    };
    return ClassModel;
}());
exports.ClassModel = ClassModel;
