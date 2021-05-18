"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authentication_1 = require("../../middleware/authentication");
const service_1 = require("../../service/service");
class HomeRoute {
    constructor() {
        this.router = express.Router();
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.service.getUsers();
            console.log(result);
            res.send(result);
        });
        this.router.get('/test', authentication_1.default, this.getUsers);
        this.service = new service_1.default();
    }
}
exports.default = HomeRoute;
//# sourceMappingURL=home.route.js.map