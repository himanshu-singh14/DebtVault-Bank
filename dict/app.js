"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var UserController_1 = __importDefault(require("./controllers/UserController"));
var User_1 = __importDefault(require("./models/User"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
// Use the controllers for specific routes
app.use("/", UserController_1.default);
User_1.default.sync().then(function () {
    console.log("Database and tables created!");
});
// Start the server
var port = 3000;
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
