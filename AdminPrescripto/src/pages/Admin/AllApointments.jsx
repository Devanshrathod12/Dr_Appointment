import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../../../frontend/src/assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import img from "../../assets/cancel_icon.svg";

const AllApointments = () => {
  const { aToken, appointment, getAllAppointment , cencelappointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormet, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointment();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
  <p className="mb-3 text-lg font-medium">All Appointment</p>
  <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
    {/* Table Headers */}
    <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
      <p>#</p>
      <p>Patient</p>
      <p>Age</p>
      <p>Date & Time</p>
      <p>Doctor</p>
      <p>Fees</p>
      <p>Action</p>
    </div>

    {/* Data Rows */}
    {appointment.map((item, index) => (
      <div
        className="grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100"
        key={index}
      >
        {/* # */}
        <p className="max-sm:hidden">{index + 1}</p>
        
        {/* Patient */}
        <div className="flex items-center gap-2">
          <img className="w-8 rounded-full" src={item.userData.image} alt="" /> 
          <p>{item.userData.name}</p>
        </div>

        {/* Age */}
        <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
        
        {/* Date & Time */}
        <p>{slotDateFormet(item.SlotDate)} , {item.SlotTime}</p>

        {/* Doctor */}
        <div className="flex items-center gap-2">
          <img className="w-8 rounded-full bg-gray-200" src={item.docData.image} alt="" />
          <p>{item.docData.name}</p>
        </div>

        {/* Fees: Align to right */}
        <p className="text-left">
          {currency}
          {item.amount}
        </p>

        {/* Action: Centered */}
        {item.cencelled
         ?<p className="text-red-400 text-xs font-medium">Cancelled</p>
         : item.isCompleted 
         ? <p className="text-green-500 text-xs font-medium">Completed</p> : <img
              onClick={() => cencelappointment(item._id)}
              className="w-10 cursor-pointer items-center"
              src={img}
              alt=""
            />
          
        }
      </div>
    ))}
  </div>
</div>

  );
};

export default AllApointments;
