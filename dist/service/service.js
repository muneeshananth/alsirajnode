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
const user_schema_1 = require("../schema/user.schema");
const jwt = require("jsonwebtoken");
class Service {
    /* function to create new User */
    signUp(userInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_schema_1.UserSchema({
                    userName: userInformation.userName,
                    firstName: userInformation.firstName,
                    lastName: userInformation.lastName,
                    password: userInformation.password,
                    emailId: userInformation.emailId,
                    phoneNumber: userInformation.phoneNumber,
                    appUser: userInformation.appUser,
                    userType: userInformation.userType,
                    documentUrl: userInformation.documentUrl,
                });
                return yield user.save();
            }
            catch (err) {
                console.log("Exception occured in signUp", err);
                throw err;
            }
        });
    }
    /* function to Login and get accessToken and RefreshToken */
    signIn(userInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    userName: userInformation.userName,
                    emailId: userInformation.emailId
                };
                const userDbInfo = yield user_schema_1.UserSchema.find({ 'emailId': userInformation.emailId }).exec();
                if (userDbInfo.length) {
                    const token = yield this.generateRefreshToken(user);
                    const refreshtoken = yield this.generateAccessToken(user);
                    return {
                        status: true,
                        message: "Signin Successfully.",
                        data: {
                            status: true,
                            token,
                            refreshtoken,
                        },
                        userType: userDbInfo[0]['userType'],
                        userDbInfo
                    };
                }
                else {
                    throw new Error('User Not found, Please signUp or please check your mail');
                }
            }
            catch (err) {
                console.log("Exception occured in signIn", err);
                throw err;
            }
        });
    }
    generateAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        });
    }
    generateRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    id: 1,
                    name: "Rakesh",
                },
                {
                    id: 2,
                    name: "Venkat",
                },
                {
                    id: 3,
                    name: "Asharaf",
                },
            ];
        });
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map