import mongoose from "mongoose";
import { Types } from "mongoose";
import validator from "validator";
import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../Models/DoctorsModel.js";
import appointmentModel from "../Models/AppointmentModel.js";
import razorpay from "razorpay";
import crypto from "crypto";

// import orders from "razorpay/dist/types/orders.js";

const RegisterUser = async (req, res) => {
  try {
    // Extract data from body
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid Email" });
    }

    // Password validation
    if (password.length < 8) {  // Fixed 'length' spelling mistake
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // Hashing password using crypto
    const salt = crypto.randomBytes(16).toString("hex"); // Generate salt
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    // Creating user object
    const UserData = {
      name,
      email,
      password: `${salt}:${hashedPassword}`, // Storing salt + hash together
    };

    // Save user to DB
    let newUser = new UserModel(UserData);
    let User = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Extract stored hash & salt
    const [salt, storedHash] = user.password.split(":");

    // Hash the incoming password with the same salt
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    // Compare hashed passwords
    if (hashedPassword === storedHash) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get user profile data

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await UserModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to update user data

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, gender, dob } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !gender || !dob) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await UserModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // upload img to cloudnaery
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await UserModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to book appointment

const bookApointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Log the received request body
    console.log("Received Request Body:", req.body);

    // Ensure SlotDate and SlotTime are provided
    if (!slotDate || !slotTime) {
      return res.json({
        success: false,
        message: "SlotDate and SlotTime are required.",
      });
    }

    // Convert docId to ObjectId using 'new'
    const docObjectId = new mongoose.Types.ObjectId(docId); // Correct usage

    const docData = await doctorModel.findById(docObjectId).select("-password");
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // Checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    // Fetch user data
    const userData = await UserModel.findById(userId).select("-password");

    // Delete slots_booked from docData (don't need to save this in the appointment)
    delete docData.slots_booked;

    // Create new appointment data
    const appointmentData = {
      userId,
      docId, // Use the correct field name here
      userData,
      docData,
      amount: docData.fees,
      SlotTime: slotTime, // Correct field name
      SlotDate: slotDate, // Correct field name
      date: Date.now(), // Automatically set to the current date/time
    };

    // Log appointment data
    console.log("Appointment Data:", appointmentData);

    // Save the appointment
    const NewAppointment = new appointmentModel(appointmentData);
    await NewAppointment.save();

    // Update the doctor's slots_booked after the appointment
    await doctorModel.findByIdAndUpdate(docObjectId, { slots_booked });

    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get users appointsments for frontend my-appointments pages

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to user chencle appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentsId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentsId);

    // If verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized Actions" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentsId, {
      cencelled: true,
    });

    // Releasing doctor's slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked || {}; // Ensure slots_booked is not undefined

    if (slots_booked[slotDate] && Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    } else {
      // Initialize the slot if it's missing
      slots_booked[slotDate] = [];
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});
// api to make payment of appointent using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentsId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentsId);
    if (!appointmentData || appointmentData.cencelled) {
      return res.json({
        success: false,
        message: "Appointment cencelled or not found",
      });
    }
    // dreating option for rozorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentsId,
    };

    // creating of an order
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to verify payment of razorpay
const VerifyRazorpay = async (req,res) => {
    try {
      const {razorpay_order_id} = req.body
      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
      console.log(orderInfo)
      if (orderInfo.status === "paid") {
        await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
        res.json({success:true,message:"Payment Successfull"})
      }else{
        res.json({success:false,message:"Payment failed"})
      }
    } catch (error) {
      console.log(error);
    res.json({ success: false, message: error.message });
    }
}

export {
  RegisterUser,
  loginUser,
  getProfile,
  updateProfile,
  bookApointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  VerifyRazorpay
};
