import React from 'react'
import Navbar from '../components/navbar.js'
import About from './about'
import Contact from './contact'
import Faqs from './faqs'
import Lhomepage from './lhomepage'
import Scholarship from './scholarship'
import PlaceIcon from '@mui/icons-material/Place';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LanguageIcon from '@mui/icons-material/Language';
import { useContext } from "react";
import { color } from "../../App";
import { useRef } from "react";
import { useInView } from "framer-motion";
import ScrollToTopButton from '../../userhome/components/scrollButton.jsx'
import '../css/page.css'

const Bmccsite = () => {
    const { colorlist,imgList } = useContext(color);

    function Section({ children }) {
        const ref = useRef(null);
        const isInView = useInView(ref);
      
        return (
          <section ref={ref}>
            <span
              style={{
                transform: isInView ? "none" : "translateX(-200px)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
              }}
            >
              {children}
            </span>
          </section>
        );
      }
  return (
    <div className='flex flex-col bg-grayish'>
        <Navbar/>
        <div className='w-full flex flex-col justify-center items-center'>
            <Section>
            <section id='home'>
                <Lhomepage/>
            </section>
            </Section>
            <div 
            className="w-full md:w-11/12 py-4 pl-4 font-bold text-xl flex justify-center items-center" 
            style={{backgroundColor:colorlist[0].bgColor,color:'white'}}>
                ABOUT US
            </div>
            <Section>
            <section id='about'>
                <About/>
            </section>
            </Section>
            <div 
        className="w-full md:w-11/12 py-4 pl-4 font-bold text-xl flex justify-center items-center" 
            style={{backgroundColor:colorlist[0].bgColor,color:'white'}}>
                CONTACT US
            </div>
            <Section>
            <section id='contact'>
                <Contact/>
            </section>
            </Section>
            <div 
        className="w-full md:w-11/12 py-4 pl-4 font-bold text-xl flex justify-center items-center" 
            style={{backgroundColor:colorlist[0].bgColor,color:'white'}}>
                SCHOLARSHIP PROGRAM
            </div>
            <Section>
            <section id='Scholarshipprogram'>
                <Scholarship/>
            </section>
            </Section>
            <div 
        className="w-full md:w-11/12 py-4 pl-4 font-bold text-xl flex justify-center items-center"  
            style={{backgroundColor:colorlist[0].bgColor,color:'white'}}>
                FREQUENTLY ASK QUESTIONS
            </div>
            <Section>
            <section id='Faqs'>
                <Faqs/>
            </section>
            </Section>
            <div className="w-full md:w-11/12 py-4 pl-4 font-bold gap-4 text-md hidden md:flex justify-center items-center" style={{backgroundColor:colorlist[0].bgColor,color:'white'}}>
                <div className='copyr'>
                    <p>Terms of Service</p>
                </div>
                <div className='location'>
                    <PlaceIcon/><span>Tabing Ilog Marilao, Bulacan</span>
                </div>
                <div className='contact'>
                    <LocalPhoneIcon /><span>{colorlist[0].telephone}</span>
                </div>
                <div className='url'>
                    <LanguageIcon /><span>http://Marisko.com</span>
            </div>
            </div>
        </div>
        <ScrollToTopButton />
    </div>
  )
}

export default Bmccsite