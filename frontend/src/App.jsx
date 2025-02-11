import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "../src/pages/Home"
import Docters from './pages/Docters'
import Login from './pages/Login'
import About from './pages/About'
import Contects from './pages/Contects'
import MyProfile from './pages/MyProfile'
import MyApointment from './pages/MyApointment'
import Apointment from "./pages/Apointment"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]' >
      <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Docters />} />
        <Route path='/doctors/:speciality' element={<Docters />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contect' element={<Contects />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-apoimment' element={<MyApointment />} />
        <Route path='/apoimment/:docId' element={<Apointment />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
