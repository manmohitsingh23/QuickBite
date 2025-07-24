import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets.js';

const Navbar = () => {
  return (
    <div className='navbar'>
        <div to='/' style={{fontSize: "1.9rem",fontWeight: "700",textDecoration: "none",fontFamily: "Poppins, sans-serif",letterSpacing: "0.5px",color: "#b30000"}}><span
            style={{
              color: "#ff4d4d" // bright reddish for "Quick"
            }}
          >
            Quick
          </span>
          Bite</div>
        <img className='profile' src={assets.profile_image} alt="" />   
    </div>
  )
}

export default Navbar
