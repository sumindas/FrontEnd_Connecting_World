import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError } from '../../Redux/Slice/authSlice';
import { verifyOtpAsync } from '../../Redux/Actions/authActions';
import './verify.css';
import axios from 'axios';
import { BASE_URL } from '../../Api/api';

const Verification = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const authError = useSelector((state) => state.auth.error);
 const [otp, setOtp] = useState('');
 const [resendTime, setResendTime] = useState(60); // Initialize to 60 seconds
 const [canResend, setCanResend] = useState(false); // Initially set to false
 const email = useSelector((state) => state.auth.email);

 const handleVerify = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(verifyOtpAsync(email, otp, navigate));
    setResendTime(60); // Reset the countdown to 60 seconds
    setCanResend(false); // Start the countdown
 };

 const handleResend = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/resend_otp/`, { email: email });
      if (response.status === 200) {
        setResendTime(30); 
        setCanResend(false);
      } else {
        console.log(response.data.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.log('Network error, please try again.');
    }
 };

 useEffect(() => {
    let intervalId;

    if (!canResend) { 
      intervalId = setInterval(() => {
        setResendTime((prevTime) => (prevTime === 0 ? 0 : prevTime - 1));
        if (resendTime === 0) {
          setCanResend(true); 
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
 }, [canResend, resendTime]); 

 return (
    <div className="verification">
      <div className="card">
        <div className="left">
          <h2>-<br /> OTP Verification <br />-</h2>
          <p>Please enter the OTP sent to {email}.</p>
        </div>
        <form className='right' onSubmit={handleVerify}>
          <label htmlFor="otp">OTP:</label>
          <input type="text" name='email' value={email} readOnly />
          <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button className='btn verify-btn' type='submit'>Verify</button>
          {canResend && (
            <button className='btn btn-red' onClick={handleResend} disabled={!canResend}>
              Resend OTP ({resendTime})
            </button>
          )}
          {authError && <p style={{ color: 'red', textAlign: 'center' }}>{authError}</p>}
        </form>
      </div>
    </div>
 );
};

export default Verification;
