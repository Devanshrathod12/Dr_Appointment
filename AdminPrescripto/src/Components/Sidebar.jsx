import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {

    const {aToken,setAToken} = useContext(AdminContext)
    const {dToken} = useContext(DoctorContext)
  return (
    <div className='min-h-screen bg-white border-r'  >
        {
            aToken && <ul className='text-[#515151] mt-5' >

             <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary " : ""} `} to={"/admin-deshboard"}>
                <img src={assets.home_icon} alt="" />
                <p className='hidden md:block  '>Deshboard</p>
             </NavLink>

             <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary " : ""} `} to={"All-Appointments"}>
                <img src={assets.appointment_icon} alt="" />
                <p className='hidden md:block  '>Appointments</p>
             </NavLink>

             <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary " : ""} `} to={"/Add-Doctor"}>
                <img src={assets.add_icon} alt="" />
                <p className='hidden md:block  '>Add Doctors</p>
             </NavLink>

             <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary " : ""} `} to={"/Doctor-list"}>
                <img src={assets.people_icon} alt="" />
                <p className='hidden md:block  '>Doctors List</p>
             </NavLink>

            </ul>
        }
        {
            dToken && <ul className='text-[#515151] mt-5' >

             <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary " : ""} `} to={"/Doctor-deshboard"}>
                <img src={assets.home_icon} alt="" />
                <p className='hidden md:block  '>Deshboard</p>
             </NavLink>

             <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary " : ""} `} to={"/Doctor-appointment"}>
                <img src={assets.appointment_icon} alt="" />
                <p className='hidden md:block'>Appointments</p>
             </NavLink>

             <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary " : ""} `} to={"/Doctor-profile"}>
                <img src={assets.people_icon} alt="" />
                <p className='hidden md:block'>Profile</p>
             </NavLink>

            </ul>
        }
    </div>
  )
}

export default Sidebar
