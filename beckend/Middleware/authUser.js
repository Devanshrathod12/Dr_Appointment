import jwt from "jsonwebtoken"

// user authentiiccation middleware
const authUser = async (req,res,next) => {
    
    try {
        const {token} = req.headers
        if (!token) {
            return res.json({success:false,message:"Not Authorize Login Again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId = token_decode.id

        next()// bina eske coll kre middle were kisi kam ka nhi

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export default authUser
