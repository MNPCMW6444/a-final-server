"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const heroku_ssl_redirect_1 = __importDefault(require("heroku-ssl-redirect"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((0, heroku_ssl_redirect_1.default)());
app.get("/", (req, res) => {
    res.send("hello world");
});
app.listen(process.env.PORT || 3000);
