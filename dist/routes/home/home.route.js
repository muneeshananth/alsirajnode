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
const paypal = require("paypal-rest-sdk");
class HomeRoute {
    constructor() {
        this.router = express.Router();
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.getUsers();
                res.json(result);
            }
            catch (err) {
                console.log("Error occured in getting user list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this.getAdmins = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.getAdmins(req.user);
                res.json(result);
            }
            catch (err) {
                console.log("Error occured in getting admin list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._sendMail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.sendMail(req.body);
                const response = {
                    status: 200,
                    message: `SucessFully sent mail to ${req.body.emailId}`
                };
                res.json(response);
            }
            catch (err) {
                console.log("Error occured in getting admin list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._payAmount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "transactions": [{
                            "item_list": {
                                "items": [{
                                        "name": "Apply in Event demo",
                                        "sku": "001",
                                        "price": "5.00",
                                        "currency": "USD",
                                        "quantity": 1
                                    }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "5.00"
                            },
                            "description": "Hat for the best team ever"
                        }]
                };
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    }
                    else {
                        res.json({ "status": '200', "message ": "sucess", "payment": payment });
                    }
                });
            }
            catch (error) {
                console.log("Error occured in getting admin list", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this.router.get('/masters/any/users/list', authentication_1.default, this.getUsers);
        this.router.get('/masters/any/admin/list', authentication_1.default, this.getAdmins);
        this.router.post('/masters/any/email/add', authentication_1.default, this._sendMail);
        this.router.post('/alsiraj/pay', this._payAmount);
        this.service = new service_1.default();
    }
}
exports.default = HomeRoute;
function Router() {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=home.route.js.map