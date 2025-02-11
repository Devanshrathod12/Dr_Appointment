import React from 'react'
import Header from '../components/Header'
import SpecalityManu from '../components/SpecialityMenu'
import ToDoctors from '../components/ToDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <SpecalityManu />
      <ToDoctors />
      <Banner />
    </div>
  )
}

export default Home
