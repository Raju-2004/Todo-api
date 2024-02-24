const jwt = require('jsonwebtoken')

module.exports = async (req,res,next)=>{
    try{
        const header = req.headers['authorization']
        if(!header)
        {
            return res.status(403).json({message : 'Forbidden Token missing'})
        }
        const token = header.split(' ')[1]
        if(!token)
        {
            return res.status(401).json({message : "Unauthorized. Invalid token format"})
        }
        const payload = await jwt.verify(token,process.env.ACCESS_SECRET_TOKEN)
        req.payload = payload
        next();
    }
    catch(err){
        console.error("Error in authentication middleware:", err);
        res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
}