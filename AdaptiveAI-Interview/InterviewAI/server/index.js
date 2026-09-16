const express = require("express");
require("dotenv").config();

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const interviewRouter = require("./routes/interview.route");
const paymentRouter = require("./routes/payment.route");

const app = express();

// CORS
const allowedOrigins = [
    "http://localhost:5173",
    "https://ai-interview-2-rayu.onrender.com",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("CORS origin not allowed"));
    },
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database
connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
