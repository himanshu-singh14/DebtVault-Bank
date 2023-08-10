"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
// Import controllers
var user_controller_1 = __importDefault(require("./controllers/user_controller"));
// Use the controllers for specific routes
app.use("/", user_controller_1.default);
// Start the server
var port = 3000;
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
