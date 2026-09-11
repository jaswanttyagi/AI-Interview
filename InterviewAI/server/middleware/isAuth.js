const jwt = require("jsonwebtoken");

const isAuth = async(req , res , next)=>{
    try{
        let {token} = req.cookies;
        if(!token){
            return res.status(400).json({  // 400 is use for frontend error
                success:false,
                message : "Token not found"
            })
        }
        // verfying token
            const verifyToken = jwt.verify(token , process.env.JWT_SECRET);
            if(!verifyToken){
                return res.status(400).json({
                    success:false,
                    message:"Invalid token"
                })
            }
            req.userId = verifyToken.userId;
            next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = isAuth