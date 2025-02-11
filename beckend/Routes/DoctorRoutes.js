import express from "express"
import { DoctorList , LoginDoctor , appointmentDoctors , AppointmentComplite , CencelAppointment , doctorDashboard , DoctorProfile , UpdateDoctorProfile} from "../Controllers/DoctorController.js"
import authDoctor from "../Middleware/authDoctor.js"


const DoctorRouter = express.Router()

DoctorRouter.get("/list",DoctorList)
DoctorRouter.post("/Login",LoginDoctor)
DoctorRouter.get("/appointment",authDoctor,appointmentDoctors)
DoctorRouter.post("/complete-appointment",authDoctor,AppointmentComplite)
DoctorRouter.post("/cancel-appointment",authDoctor,CencelAppointment)
DoctorRouter.get("/dashboard",authDoctor,doctorDashboard)
DoctorRouter.get("/profile",authDoctor,DoctorProfile)
DoctorRouter.post("/update-profile",authDoctor,UpdateDoctorProfile)


export default DoctorRouter