const User = require("../models/user");

const getCurrentUser = async(req , res)=>{
    try{
        const userId = req.userId
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        return res.status(200).json(user);
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server Error to get Current user"
        })
    }
}
module.exports = getCurrentUser;