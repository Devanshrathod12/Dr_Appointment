import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData,setDashData] = useState(false)
  const [profileData,setProfileData] = useState(false)

  const getAppointment = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/appointment", {
        headers: { dToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
        // console.log(data.appointments)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const  completeAppointment = async (appointmentsId) => {
      try {
        const {data} = await axios.post(backendUrl + "/api/doctor/complete-appointment" , {appointmentsId} , {headers:{dToken}})
        if (data.success) {
          toast.success(data.message)
          getAppointment()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error);
      toast.error(error.message);
      }
  }


  const  CencelAppointment = async (appointmentsId) => {
    try {
      const {data} = await axios.post(backendUrl + "/api/doctor/cancel-appointment" , {appointmentsId} , {headers:{dToken}})
      if (data.success) {
        toast.success(data.message)
        getAppointment()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
    toast.error(error.message);
    }
}

 const getdashData = async () => {
  try {
    const {data} = await axios.get(backendUrl + "/api/doctor/dashboard" , {headers:{dToken}})
    if (data.success) {
      setDashData(data.dashData)
      console.log(data.dashData)
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
 } 

 const getprofileData = async () => {
  try {
      const {data} = await axios.get(backendUrl + "/api/doctor/profile" ,{headers:{dToken}})
      if (data.success) {
        setProfileData(data.profileData)
        console.log(data.profileData)
      }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
 }

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointment,
    completeAppointment,
    CencelAppointment,
    dashData,
    setDashData,
    getdashData,
    profileData,
    setProfileData,
    getprofileData

  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
