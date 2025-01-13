"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./src/routes/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const App = (0, express_1.default)();
const port = 3000;
const mongoDB = "mongodb://127.0.0.1:27017/testdb"; //mongodb://localhost:27017/testdb.
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
App.use(express_1.default.json());
App.use(express_1.default.urlencoded({ extended: false }));
App.use((0, morgan_1.default)("dev"));
App.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
App.use("/", index_1.default);
App.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
