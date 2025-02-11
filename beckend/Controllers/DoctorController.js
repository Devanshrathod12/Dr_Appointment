import doctorModel from "../Models/DoctorsModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../Models/AppointmentModel.js";
const ChangeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "availablity Changed" });
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

// api for doctor login

const LoginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search for the doctor using the email
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      console.log("Doctor not found with email:", email); // Logging invalid email
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      console.log("Password mismatch for email:", email); // Logging invalid password
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get appointment for doctor pennal
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

// api to mark complited appointment for doctor penal
// const AppointmentComplite = async (req,res) => {
//     try {
//         const {docId,appointmentsId} = req.body;
//         const appointmentData = appointmentModel.findById(appointmentsId)

//         if (appointmentData && appointmentData.docId === docId) {
//             await appointmentModel.findByIdAndUpdate(appointmentsId, {isCompleted:true})
//             return res.json({success:true,message:"Appointment Completed"})
//         } else {
//             return res.json({success:false,message:"Mark failed"})
//         }

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }
const AppointmentComplite = async (req, res) => {
  try {
    const { docId, appointmentsId } = req.body;
    // Await the appointment data to ensure it's retrieved
    const appointmentData = await appointmentModel.findById(appointmentsId); // Added await here

    if (
      appointmentData &&
      appointmentData.docId.toString() === docId.toString()
    ) {
      // Ensuring both are compared correctly
      // Mark appointment as completed
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

// api to  cencel appointment for doctor penal
const CencelAppointment = async (req, res) => {
  try {
    const { docId, appointmentsId } = req.body; // Replacing appointmentId with appointmentsId

    // Log the input values to check if they're correct
    console.log("Received docId:", docId);
    console.log("Received appointmentsId:", appointmentsId);

    // Await the appointment data to ensure it's properly fetched from the database
    const appointmentdata = await appointmentModel.findById(appointmentsId); // Using appointmentsId here

    // Check if appointment exists
    if (!appointmentdata) {
      console.log("Appointment not found");
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Log appointment data to ensure it's being fetched correctly
    console.log("Found appointment data:", appointmentdata);

    // Ensure the docId matches the one stored in the appointment
    if (appointmentdata.docId.toString() === docId.toString()) {
      // Mark appointment as cancelled
      await appointmentModel.findByIdAndUpdate(appointmentsId, {
        cencelled: true,
      }); // Updated here
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

// api to get dashboard data for doctor pennal
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let earnning = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnning += item.amount;
      }
    });

    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnning,
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

// api to get doctor profile for doctor panal
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

//api to update doctor profile data from doctor penal
const UpdateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    res.json({ success: true, message: "profile Updated" });
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
  UpdateDoctorProfile
};
