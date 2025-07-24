/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import './OTPpopup.css';
import { StoreContext } from "../../context/StoreContext";

const OTPpopup = ({ onOtpSubmit,data }) => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [timer, setTimer] = useState(60); // Initial timer set to 30 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially disable resend button
  const {url}=useContext(StoreContext);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

    // Countdown timer effect
    useEffect(() => {
        if (timer > 0) {
          const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
          console.log(timer);
          return () => clearInterval(interval);
        } else {
          setIsResendDisabled(false); // Enable resend after countdown
        }
    }, [timer]);
    

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Limit input to one digit per field
    setOtp(newOtp);

    // Submit OTP if all fields are filled
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === 4) onOtpSubmit(combinedOtp);

    // Move to the next input if current field is filled
    if (value && index < 4 - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus(); // Move to the previous input on backspace
    }
  };

  const handleResendOTP = async () => {
    try {
      // Call backend resend OTP endpoint
      console.log("resend otp data:",data);
      const response=await axios.post(`${url}/api/user/resendOTP`, { userId:data.userId, email:data.email });
      if(!response.data.success){
        toast.error(response.data.message);
      }
      setTimer(60); // Reset the timer
      setIsResendDisabled(true); // Disable resend button until timer resets
      toast.success("A new OTP has been sent to your email."); // Display success message
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="otp-popup">
        <div className="otp-container">
            <h3>Enter OTP</h3>
            <div className="otp-inputs">
                {otp.map((value, index) => (
                    <input
                    key={index}
                    type="text"
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otpInput"
                    maxLength="1" // Limit each input to one character
                    />
                ))}
            </div>

            {isResendDisabled?<div className="showtimer">Resend OTP in {timer}s</div>:
            <button
            className="resend-otp-button"
            onClick={handleResendOTP}
            disabled={isResendDisabled}
            >
            Resend OTP
            </button>
            }
      </div>
    </div>
  );
};

export default OTPpopup;
