import React, { useContext, useState , useEffect , } from 'react'
import { AppContext } from '../components/Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from "react-router-dom"
const MyApointment = () => {

    const {backendUrl , token, getDoctorsData} = useContext(AppContext)
    const [appointments,setAppointments] = useState([])
    const months = ["","Jan","Fab","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nav","Dec"]
    const slotDateFormet = (SlotDate ) => {
      const dateArray = SlotDate.split("_")
      return dateArray[0]+ " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }
    
    const navigate = useNavigate()
    const getUserAppointments = async (req,res) => {
  try {
     const {data}  = await axios.get(backendUrl + "/api/user/appointments",{headers:{token}})
     
     if (data.success) {
      setAppointments(data.appointments.reverse())
      console.log(data.appointments)
     }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
    }

const cancelAppointment = async (appointmentsId) => {
  try {
    

    const {data} = await axios.post(backendUrl+ "/api/user/cencel-appointment" , {appointmentsId} , {headers:{token}})

    if (data.success) {
      toast.success(data.message)
      getUserAppointments()
      getDoctorsData()
    }else {
      toast.error(data.message)
    }

  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

const initPay = (order) => {
  const options = {
    key:import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount:order.amount,
    currency:order.currency,
    name:"Appointment Payment",
    description:"Appointment Payment",
    order_id: order.id,
    receipt: order.receipt,
    handler: async (response) => {
     console.log(response)  
     
     try {
      const {data} = await axios.post(backendUrl+"/api/user/VerifyRazorpay",response,{headers:{token}})
      if (data.success) {
        getUserAppointments()
        navigate("/my-apoimment")
      }
     } catch (error) {
      console.log(error)
    toast.error(error.message)
     }

     
    }
}
 const rzp = new window.Razorpay(options)
 rzp.open()
}

const appointmentRazorpay = async (appointmentsId) => {
   try {
    const {data} = await axios.post(backendUrl+"/api/user/payment-razorpay",{appointmentsId},{headers:{token}})

    if (data.success) {
        console.log(data.order)
        initPay(data.order)
    }
   } catch (error) {
    
   }
}

    useEffect(() => {
    if (token) {
      getUserAppointments()
    }
    
    }, [token])
    


  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b  '>My appointments</p>
      <div>
       {appointments.map((item , index)=>(
        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b  ' key={index}>
           <div>
            <img className='w-32 bg-indigo-50 ' src={item.docData.image} alt="" />
           </div>
           <div className='flex-1 text-sm text-zinc-600   '>
            <p className='text-neutral-800 font-semibold '>{item.docData.name}</p>
            <p>{item.docData.speciality}</p>
            <p className='text-zinc-700 font-medium mt-1 '>Address:</p>
            <p className='text-xs'>{item.docData.address.line1}</p>
            <p className='text-xs'>{item.docData.address.line2}</p>
            <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotDateFormet(item.SlotDate)} |{item.SlotTime}</p>
           </div>
           <div></div>
           <div className='flex flex-col gap-2 justify-end'>
            {!item.cencelled  && item.payment && !item.isCompleted && <button className='sm-min-w-48 py-2 border rounded text-stone-500 bg-indigo-50  ' >Paid</button>}
           {!item.cencelled && !item.payment &&  !item.isCompleted &&   <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-primary  hover:text-white transition-all duration-300 '>Pay Online</button> }
           {!item.cencelled &&  !item.isCompleted &&  <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600  hover:text-white transition-all duration-300'>Cancel Appointment</button>} 
           {item.cencelled &&  !item.isCompleted &&  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500  ' >Appointment cancelld</button>}
           {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button> }
           </div>
        </div>
       ))}
      </div>
    </div>
  )
}

export default MyApointment
