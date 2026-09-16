const jwt = require("jsonwebtoken");

const genToken = (userId) => {
    try {
        return jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = genToken