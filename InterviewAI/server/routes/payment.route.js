const express = require("express");

const isAuth = require("../middleware/isAuth");

const {
    createOrder,
    verifyPayment
} = require("../controllers/payment.controller");

const paymentRouter = express.Router();

paymentRouter.post("/order", isAuth, createOrder);

paymentRouter.post("/verify", isAuth, verifyPayment);

module.exports = paymentRouter;