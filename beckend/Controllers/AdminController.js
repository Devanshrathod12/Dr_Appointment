import Validator from "validator";
import crypto from "crypto";
import { v2 as cloudnary } from "cloudinary";
import doctorModel from "../Models/DoctorsModel.js";
import UserModel from "../Models/UserModel.js";
import JWT from "jsonwebtoken";
import appointmentModel from "../Models/AppointmentModel.js";

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        if (!Validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

        const imageUpload = await cloudnary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const DoctorData = {
            name,
            email,
            image: imageUrl,
            password: `${salt}:${hashedPassword}`,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        };

        const newdoctor = new doctorModel(DoctorData);
        await newdoctor.save();

        res.json({ success: true, message: "Doctor added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const LoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = JWT.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const AllDoctor = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password");
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const adminappointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const cencelappointment = async (req, res) => {
    try {
        const { appointmentsId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentsId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentsId, { cencelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        if (!doctorData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        let slots_booked = doctorData.slots_booked || {};
        if (slots_booked[slotDate] && Array.isArray(slots_booked[slotDate])) {
            slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
        } else {
            slots_booked[slotDate] = [];
        }

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        res.json({ success: true, message: "Appointment cancelled" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const AdminDeshboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await UserModel.find({});
        const appointment = await appointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
            appointment: appointment.length,
            patients: users.length,
            latestAppointment: appointment.reverse().slice(0, 5)
        };
        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addDoctor, LoginAdmin, AllDoctor, adminappointments, cencelappointment, AdminDeshboard };
