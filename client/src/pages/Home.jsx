import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
    {/* Jitne bhi components humne banaye hain jo jo home page pe dikhenge use hum hum home page pe mount karte hain home page pe dikhne ke liye. */}
      <Navbar />
      <Hero />
      <AiTools/>
      <Testimonial /> {/* This component we get prebuilt AI.com */}
      <Plan/>
      <Footer/> {/* This footer component also we had made with using prebuiltUI.com */}
    </>
  )
}

export default Home
