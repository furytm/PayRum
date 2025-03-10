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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./prisma/client"); // Import Prisma client
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const errorHandler_1 = require("./middlewares/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middlewares
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use('/api/auth', auth_routes_1.default);
// Routes (to be added later)
app.get('/', (req, res) => {
    res.send('Payroll System API');
});
// Error Handler Middleware (must be at the end)
app.use((err, req, res, next) => {
    (0, errorHandler_1.errorHandler)(err, req, res, next);
});
// Connect to PostgreSQL database via Prisma
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client_1.prisma.$connect(); // Connect to PostgreSQL
            console.log("Connected to PostgreSQL successfully!");
            // Start the server
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
        catch (error) {
            console.error("Failed to connect to the database:", error);
            process.exit(1); // Exit if connection fails
        }
    });
}
startServer();
