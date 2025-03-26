"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const demoRequest_1 = require("../controllers/demoRequest");
const router = (0, express_1.Router)();
router.post('/', demoRequest_1.createRequestDemo);
exports.default = router;
