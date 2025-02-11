import doctorModel from "../Models/DoctorsModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import appointmentModel from "../Models/AppointmentModel.js";

const ChangeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const DoctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const LoginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      console.log("Doctor not found with email:", email);
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const hashedPassword = hashPassword(password);

    if (hashedPassword === doctor.password) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      console.log("Password mismatch for email:", email);
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentDoctors = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const AppointmentComplite = async (req, res) => {
  try {
    const { docId, appointmentsId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentsId);

    if (
      appointmentData &&
      appointmentData.docId.toString() === docId.toString()
    ) {
      await appointmentModel.findByIdAndUpdate(appointmentsId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const CencelAppointment = async (req, res) => {
  try {
    const { docId, appointmentsId } = req.body;
    console.log("Received docId:", docId);
    console.log("Received appointmentsId:", appointmentsId);

    const appointmentdata = await appointmentModel.findById(appointmentsId);

    if (!appointmentdata) {
      console.log("Appointment not found");
      return res.json({ success: false, message: "Appointment not found" });
    }

    console.log("Found appointment data:", appointmentdata);

    if (appointmentdata.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentsId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      console.log("DocId mismatch");
      return res.json({
        success: false,
        message: "Cancellation failed. DocId mismatch.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    let earning = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
    });

    let patients = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const DoctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const UpdateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  ChangeAvailablity,
  DoctorList,
  LoginDoctor,
  appointmentDoctors,
  AppointmentComplite,
  CencelAppointment,
  doctorDashboard,
  DoctorProfile,
  UpdateDoctorProfile,
};
