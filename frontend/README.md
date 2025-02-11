# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```
{
    // import React, { useContext, useState } from 'react'
// import { AppContext } from '../components/Context/AppContext'
// import axios from "axios"
// import { toast } from 'react-toastify'

// const Login = () => {

//   const {backendUrl , token , setToken} = useContext(AppContext)

//   const [state,setState] = useState('Sign Up')
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [Password, setPassword] = useState('')

//   const onSubmitHandler = async (event) => {
//     event.preventDefault()

//     try {
      
//       if (state === "Sign Up") {
//         const {data} = await axios.post(backendUrl + "/api/user/register" , {name, email , Password})
       
//         if (data.success) {
//           localStorage.setItem("token",data.token)
//           setToken(data.token)
//         } else{
//           toast.error(data.message)
//         }
//       } else {

//         const {data} = await axios.post(backendUrl + "/api/user/login" , {email , Password})
       
//         if (data.success) {
//           localStorage.setItem("token",data.token)
//           setToken(data.token)
//         } else{
//           toast.error(data.message)
//         }

//       }


//     } catch (error) {
//       toast.error(error.message) 
//     }

//   }
//   return (
//     <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex item-center'>
//      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg ' >
//       <p className='text-2xl font-semibold' >{state === 'Sign Up' ? "Create Account" : "Login" }</p>
//       <p>Please {state === 'Sign Up' ? "Sign Up" : "Login" } to book appointment</p>
//       {
//         state === "Sign Up"  && <div className='w-full'>
//         <p>Full Name</p>
//         <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setName(e.target.value)} value={name} required/>
//       </div>
//       }
//       <div className='w-full'>
//         <p>Email</p>
//         <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
//       </div>
//       <div className='w-full'>
//         <p>Password</p>
//         <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setPassword(e.target.value)} value={Password} required/>
//       </div>
//       <button type='submit' className='bg-primary text-white w-full p-2 rounded-md  text-base' >{state === 'Sign Up' ? "Create Account" : "Login" }</button>
//       {
//         state === "Sign Up" 
//         ?
//         <p>Already have an account? <span onClick={()=>setState('Login')} className='text-primary underline cursor-pointer'>Login here</span> </p>
//         :
//         <p>Create an new account? <span onClick={()=>setState('Sign Up')} className='text-primary underline cursor-pointer'>click here</span> </p>
//       }
//       </div>
//     </form>
//   )
// }

// export default Login

}
```

{!item.cencelled &&  <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-primary  hover:text-white transition-all duration-300 '>Pay Online</button> }
           {!item.cencelled && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600  hover:text-white transition-all duration-300'>Cancel Appointment</button>} 
           {!item.cencelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500  ' >Appointment cancelld</button>}