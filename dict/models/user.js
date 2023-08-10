"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(name, mobileNumber, password, email, address, dateOfBirth, isLoggedIn, createdAt, updatedAt) {
        if (email === void 0) { email = null; }
        if (address === void 0) { address = null; }
        if (dateOfBirth === void 0) { dateOfBirth = null; }
        if (isLoggedIn === void 0) { isLoggedIn = false; }
        if (createdAt === void 0) { createdAt = null; }
        if (updatedAt === void 0) { updatedAt = null; }
        //@ts-ignore
        this.name = name; //@ts-ignore
        this.mobileNumber = mobileNumber; //@ts-ignore
        this.password = password; //@ts-ignore
        this.email = email; //@ts-ignore
        this.address = address; //@ts-ignore
        this.dateOfBirth = dateOfBirth; //@ts-ignore
        this.isLoggedIn = isLoggedIn; //@ts-ignore
        this.createdAt = createdAt; //@ts-ignore
        this.updatedAt = updatedAt;
    }
    return User;
}());
exports.default = User;
