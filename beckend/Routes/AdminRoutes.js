import express from "express";
import { addDoctor ,AllDoctor,LoginAdmin, adminappointments , cencelappointment , AdminDeshboard} from "../Controllers/AdminController.js";
import upload from "../Middleware/Multer.js";
import authAdmin from "../Middleware/authAdmin.js";
import {ChangeAvailablity} from "../Controllers/DoctorController.js"
const adminRouter = express.Router();

adminRouter.post("/add-doctor",authAdmin,upload.single('image'), addDoctor); // Ensure field name 'image' matches the file input
adminRouter.post("/login",LoginAdmin)
adminRouter.post("/all-doctors",authAdmin,AllDoctor)
adminRouter.post("/change-availablity",ChangeAvailablity,)
adminRouter.get("/appointment",authAdmin,adminappointments)
adminRouter.post("/cancel-appointment",authAdmin,cencelappointment)
adminRouter.get("/dashboard",authAdmin,AdminDeshboard)

export default adminRouter;
