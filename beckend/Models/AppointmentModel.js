import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: {type: String, required :true},
    docId: {type: String, required :true},
    SlotDate: {type: String, required :true},
    SlotTime: {type: String, required :true},
    userData: {type: Object, required :true},
    docData: {type: Object, required :true},
    amount: {type: Number, required :true},
    date: {type: Number, required :true},
    cencelled : {type:Boolean , default:false},
    payment : {type:Boolean, default:false},
    isCompleted : {type:Boolean, default:false},
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)
export default appointmentModel