import React from 'react'
import { useState,useEffect } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import OTPpopup from '../OTPpopup/OTPpopup';

const LoginPopup = ({setShowLogin}) => {
    const {url,setToken}=useContext(StoreContext);
    const [currState,setCurrState]=useState("Sign Up");
    const [showOTP, setShowOTP] = useState(false); // Local state to show/hide OTP input
    const [OTP, setOTP] = useState(""); // State to store the entered OTP
    const [data,setData]=useState({
      name:"",
      email:"",
      password:"",
    });

    const onChangeHandler=(event)=>{
      const name=event.target.name;
      const value=event.target.value;

      setData(data=>({...data,[name]:value}))
    }

    const onOtpSubmit=(otp)=>{
      if (!otp) {
        toast.error("Please enter a valid OTP.");
        return;
      }
      toast.success(otp);
      setOTP(otp);
      console.log("OTP:",OTP);
      verifyOtp(otp);
    }


    const onLogin=async(event)=>{
      event.preventDefault();
      let newUrl=url;
      if(currState==="Login"){
        newUrl+="/api/user/login";
      }else{
        newUrl+="/api/user/register";
        const response=await axios.post(newUrl,data);
        console.log(response);
        if (response.data.success) {
          setData((prevData) => ({ ...prevData, userId: response.data.data.userId,email:response.data.data.email }));
          // setIdUser(response.data.userId);
          console.log("userId set in idUser:", response.data.data.userId);
          console.log("data after userId:",data);
          // setShowLogin(false);
          setShowOTP(true);
          console.log("showotp:",showOTP)
          toast.success("Account created! Please enter the OTP sent to your email.");

        } else {
          toast.error(response.data.message);
        }
        return;
      }

      const response=await axios.post(newUrl,data);

      if(response.data.success){
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token);
        setShowLogin(false);
      }else{
        alert(response.data.message);
      }
    }


    const verifyOtp = async (otp) => {
      try {
        // Send OTP and userId (assumes userId is available after OTP is sent)
        console.log("data in verify",data);
        // console.log("idUser:",idUser);
        console.log("verify OTP:",OTP);
        const response = await axios.post(`${url}/api/user/verifyOTP`, { otp:otp, userId: data.userId });
    
        if (response.data.success) {
          // OTP verified; set token and close login popup
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          setShowLogin(false); // Close the login popup
          setShowOTP(false); // Hide the OTP input after successful verification
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        toast.error("An error occurred during OTP verification. Please try again.");
      }
    };

    useEffect(() => {
      console.log("OTP Popup visibility:", showOTP);
    }, [showOTP]); // Log when showOTP changes

  return (
    <>
    {!showOTP && (
    <div className='login-popup'>
      <form className='login-popup-container' action="" onSubmit={onLogin}>
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
            {currState==="Login"?<></>:<input type="text" name='name' onChange={onChangeHandler} value={data.name} placeholder='Your Name' required/>}
            <input name='email' onChange={onChangeHandler} value={data.email} type="text" placeholder='Your Email' required />
            <input name='password' onChange={onChangeHandler} value={data.password} type="text" placeholder='Password' required/>
        </div>
        <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
        <div className='login-popup-condition'>
            <input type="checkbox" name="" id="" required/>
            <p>By continuing, i agree to the terms of use & privacy policy </p>
        </div>
        {currState==="Login"?
            <p>Create a new account ? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>:
            <p>Already have an account ? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
        }  
    </form>

    </div> )}
    {showOTP && (<OTPpopup onOtpSubmit={onOtpSubmit} data={data}/>)}
    </>
  )
}

export default LoginPopup
