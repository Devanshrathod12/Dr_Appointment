import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  
  const [doctors, setDoctors] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [dashData,setDeshData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async (req, res) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailablity = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availablity",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointment = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointment", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointment(data.appointments);
        console.log(data.appointments)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cencelappointment = async (appointmentsId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",  // Check if this URL is correct
        { appointmentsId }, 
        { headers: { aToken } }
      );
      
      if (data.success) {
        toast.success(data.message);
        getAllAppointment();
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message); // More detailed error message
    }
  };

  const getDashData = async () => {
     try {
       const {data} = await axios.get(backendUrl + "/api/admin/dashboard" , {headers:{aToken}})
       if (data.success) {
        setDeshData(data.dashData)
        console.log(data.dashData)
       } else{
        toast.error(data.message)
       }
     } catch (error) {
      toast.error("Error: " + error.message);
     }
  }
  

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailablity,
    appointment,
    setAppointment,
    getAllAppointment,
    cencelappointment,
    dashData,
    getDashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
