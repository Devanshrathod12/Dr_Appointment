import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getdashData , CencelAppointment , completeAppointment} =
    useContext(DoctorContext);
  const { currency, slotDateFormet } = useContext(AppContext);
  useEffect(() => {
    if (dToken) {
      getdashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3 ">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all ">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 ">
                {currency} {dashData.earnning}
              </p>
              <p className="text-gray-400">Earnning</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all ">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 ">
                {dashData.appointment}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 hover:scale-105 transition-all ">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 ">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
                  <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border ">
                    <img src={assets.list_icon} alt="" />
                    <p className="font-semibold">Latest Bookings</p>
                  </div>
                  <div className="pt-4 border border-t-0">
                    {dashData.latestAppointments.map((item, index) => (
                      <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 " key={index}>
                        <img className="rounded-full w-10" src={item.userData.image} alt="" />
                        <div className="flex-1 text-sm">
                          <p className="text-gray-800 font-medium " >{item.userData.name}</p>
                          <p className="text-gray-600" >{slotDateFormet(item.SlotDate)}</p>
                        </div>
                       {
                                         item.cencelled
                                         ? <p className='text-red-400 text-xs font-medium' >Cencelled</p>
                                         : item.isCompleted
                                         ? <p className='text-green-400 text-xs font-medium'>Completed</p>
                                         : <div className=' flex'>
                                         <img onClick={()=>CencelAppointment(item._id)} className='w-10 cursor-pointer  ' src={assets.cancel_icon} alt="" />
                                         <img onClick={()=>completeAppointment(item._id)} className='w-10 cursor-pointer  ' src={assets.tick_icon} alt="" />
                                       </div>
                                       } 
                      </div>
                    ))}
                  </div>
                </div>
      </div>
    )
  );
};

export default DoctorDashboard;
