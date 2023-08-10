"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("../database/database"));
var user_1 = __importDefault(require("../models/user"));
database_1.default.connect();
var UserDao = /** @class */ (function () {
    function UserDao() {
    }
    // Retrieves a user by their mobile number
    UserDao.prototype.getUserByMobileNumber = function (mobileNumber) {
        return new Promise(function (resolve, reject) {
            var query = "SELECT * FROM user WHERE mobileNumber = '".concat(mobileNumber, "'");
            database_1.default.query(query, function (err, rows, fields) {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length === 0) {
                    resolve(null); // No user found with the given mobile number
                }
                else {
                    var user = new user_1.default(rows[0].name, rows[0].mobileNumber, rows[0].password, rows[0].email, rows[0].address, rows[0].dateOfBirth, rows[0].isLoggedIn ? true : false, rows[0].createdAt, rows[0].updatedAt);
                    resolve(user);
                }
            });
        });
    };
    // Insert user to database
    UserDao.prototype.insert = function (user) {
        var query = "INSERT INTO user (name, mobileNumber, password) VALUES ('".concat(user.name, "', '").concat(user.mobileNumber, "', '").concat(user.password, "');");
        database_1.default.query(query, function (err, rows, fields) {
            if (err)
                throw err;
        });
    };
    return UserDao;
}());
exports.default = UserDao;
