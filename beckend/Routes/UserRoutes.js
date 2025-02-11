import express from "express"
import { RegisterUser , getProfile, loginUser , updateProfile , bookApointment , listAppointment , cancelAppointment , paymentRazorpay , VerifyRazorpay} from "../Controllers/UserController.js"
import authUser from "../Middleware/authUser.js"
import upload from "../Middleware/Multer.js"


const UsersRouter = express.Router()

UsersRouter.post("/register",RegisterUser)
UsersRouter.post("/login",loginUser)
UsersRouter.get("/get-Profile",authUser,getProfile)
UsersRouter.post("/update-profile",upload.single("image"),authUser,updateProfile)
UsersRouter.post("/book-appointment",authUser,bookApointment)
UsersRouter.get("/appointments",authUser,listAppointment)
UsersRouter.post("/cencel-appointment",authUser,cancelAppointment)
UsersRouter.post("/payment-razorpay",authUser,paymentRazorpay)
UsersRouter.post("/VerifyRazorpay",authUser,VerifyRazorpay)
export default UsersRouter