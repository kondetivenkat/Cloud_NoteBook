const jwt = require('jsonwebtoken');
const JWT_secret = "hi!iam good boy";

const fetchUser=(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).json({error:"invalid authentication"});
    }
    try {
        const data=jwt.verify(token,JWT_secret);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).json({error:"invalid authentication"});
    }
}

module.exports = fetchUser;