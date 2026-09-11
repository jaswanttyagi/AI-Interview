const express = require("express");

const { analayzeResume, generateQuestions, submitAnswer, finishInterview, getMyInterviews, getInterviewReport } = require("../controllers/Interview.controller");
const isAuth = require("../middleware/isAuth");
const { upload } = require("../middleware/multer");

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analayzeResume);

interviewRouter.post("/generate-questions" , isAuth , generateQuestions)
interviewRouter.post("/submit-answer" , isAuth , submitAnswer)
interviewRouter.post("/finish" , isAuth , finishInterview)
interviewRouter.get("/get-interview" , isAuth , getMyInterviews)
interviewRouter.get("/report/:id" , isAuth , getInterviewReport)
module.exports = interviewRouter;