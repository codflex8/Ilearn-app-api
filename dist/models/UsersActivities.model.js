"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersActivities = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
let UsersActivities = class UsersActivities extends BaseModel_1.BaseModel {
};
exports.UsersActivities = UsersActivities;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UsersActivities.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], UsersActivities.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-array", nullable: true }),
    __metadata("design:type", Array)
], UsersActivities.prototype, "usersIds", void 0);
exports.UsersActivities = UsersActivities = __decorate([
    (0, typeorm_1.Entity)()
], UsersActivities);
//# sourceMappingURL=UsersActivities.model.js.map