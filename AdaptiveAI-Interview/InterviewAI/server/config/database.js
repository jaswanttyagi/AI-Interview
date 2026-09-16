const mongoose = require("mongoose");
const dns = require("dns");

require("dotenv").config();

// Use reliable DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

        console.log("DATABASE CONNECTED SUCCESSFULLY");
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;