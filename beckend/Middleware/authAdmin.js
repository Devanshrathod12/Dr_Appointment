import jwt from "jsonwebtoken"

// admin authentiiccation middleware
const authAdmin = async (req,res,next) => {
    
    try {
        const {atoken} = req.headers
        if (!atoken) {
            return res.json({success:false,message:"Not Authorize Login Again"})
        }
        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success:false,message:"Not Authorize Login Again"})
        }

        next()// bina eske coll kre middle were kisi kam ka nhi

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export default authAdmin
