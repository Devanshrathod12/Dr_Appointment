import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from './context/AdminContext';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Deshboard from "./pages/Admin/Deshboard"
import AllApointments from './pages/Admin/AllApointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  return aToken || dToken ? (
    <div className='bg-[#F8F9FD] ' >
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'  >
        <Sidebar/>
        <Routes>
          {/* admin route */}
          <Route path='/' element={<></>} />
          <Route path='/admin-deshboard' element={<Deshboard/>} />
          <Route path='/All-Appointments' element={<AllApointments/>} />
          <Route path='/Add-Doctor' element={<AddDoctor/>} />
          <Route path='/Doctor-list' element={<DoctorsList/>} />
          {/* doctor route */}
          <Route path='/Doctor-deshboard' element={<DoctorDashboard/>} /> 
          <Route path='/Doctor-appointment' element={<DoctorAppointment/>} /> 
          <Route path='/Doctor-profile' element={<DoctorProfile/>} /> 
        </Routes>
      </div>
    </div>
  ): (
    <>
     <Login />
     <ToastContainer/>
    </>
  )
}

export default App
