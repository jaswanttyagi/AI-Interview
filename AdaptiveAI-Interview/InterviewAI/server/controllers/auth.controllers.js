// fetch data from frontend
//create user in database
//token genration and store json token on cookies so we can find the current user

const User = require("../models/user");
const genToken = require("../config/token");

// Google Auth Controller
const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Find existing user
        let user = await User.findOne({ email });

        // Create user if doesn't exist
        if (!user) {
            user = await User.create({
                name,
                email
            });
        }

        // Generate token
        const token = await genToken(user._id);

        // Store token in cookie
       res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
});

        return res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Google auth error"
        });
    }
};


// Logout Controller
const logOut = async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Logout error"
        });
    }
};


module.exports = {
    googleAuth,
    logOut
};
