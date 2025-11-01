import jwt from "jsonwebtoken";
const isAuthenticated = async (req,res, next)=>{//next send it to the next middleware
    try {
        const token = req.cookies.token;//as we have it name token to the cookie return res.status(200).cookie("token", token,....
        if(!token){
            return res.status(401).json({//next() is not called so it will not go to the next middleware/function
                message:"User not authenticated",
                success:false
            })
        };
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            });
        }
        req.id = decode.userId;//as we stored the user id in the token
        next();
    } catch (error) {
        console.log(error);
    }
}
export default isAuthenticated;