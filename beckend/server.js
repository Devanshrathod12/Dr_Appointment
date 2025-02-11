import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import ConnectDb from './Config/MongoDB.js'
import connectcloudinary from './Config/Cloudinery.js'
import adminRouter from './Routes/AdminRoutes.js'
import DoctorRouter from './Routes/DoctorRoutes.js'
import UsersRouter from './Routes/UserRoutes.js'
// app config 
const app = express();
const port = process.env.PORT || 4000
ConnectDb()
connectcloudinary()

//middleware 
app.use(express.json())
app.use(cors()) // alw to conct fronted to becked


// api endpoint 
app.use("/api/admin",adminRouter)
app.use("/api/doctor",DoctorRouter)
app.use("/api/user",UsersRouter)

app.get("/",(req,res)=>{
    res.send("api working")
}) 

app.listen(port,()=>
    console.log("server running on port",port)) 