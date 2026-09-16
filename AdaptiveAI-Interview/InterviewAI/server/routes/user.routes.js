const express = require("express");
const isAuth = require("../middleware/isAuth");
const  getCurrentUser = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/current-user" , isAuth , getCurrentUser);

module.exports = userRouter;