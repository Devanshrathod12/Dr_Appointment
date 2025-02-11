import jwt from "jsonwebtoken"

// docotr authentiiccation middleware
const authDoctor = async (req,res,next) => {
    
    try {
        const {dtoken} = req.headers
        if (!dtoken) {
            return res.json({success:false,message:"Not Authorize Login Again"})
        }
        const token_decode = jwt.verify(dtoken,process.env.JWT_SECRET)
        req.body.docId = token_decode.id

        next()// bina eske coll kre middle were kisi kam ka nhi

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export default authDoctor
