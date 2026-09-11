const express = require("express");
const { googleAuth, logOut } = require("../controllers/auth.controllers");

const authRouter = express.Router();

authRouter.post("/google" , googleAuth);
authRouter.get("/logout" , logOut);

module.exports = authRouter;