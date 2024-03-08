import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './passwordReset.css'; 
import axios from 'axios';
import { BASE_URL } from '../../Api/api';
import { setResetEmail } from '../../Redux/Slice/authSlice';

const PasswordReset = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const [otp, setOtp] = useState('');
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [error,setError] = useState('')
 const ResetEmail = useSelector((state) => state.auth.reset_email); 
 console.log("reset",ResetEmail)


 useEffect(()=>{
  if (!ResetEmail){
    navigate('/')
  }
  else{
    navigate('/resetpassword')
  }
 },[ResetEmail, navigate])

 const handleReset = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
  }
  try {
    const response = await axios.post(`${BASE_URL}/password-reset/`, {
        email: ResetEmail, 
        otp: otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
    });

    if (response.status === 200) {
        setError('')
        alert(response.data.message);
        dispatch(setResetEmail(''))
        navigate('/login'); 
    } 
} catch (error) {
    console.error('Error during password reset:', error);
    if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
    } else {
        setError("An error occurred. Please try again.");
    }
}
 };

 return (
    <div className="passwordReset">
      <div className="card">
        <div className="left">
          <h2>-<br />Password Reset<br />-</h2>
          <p>Please enter the OTP sent to {ResetEmail} and your new password.</p>
        </div>
        <form className='right' onSubmit={handleReset}>
          <label htmlFor="otp">OTP:</label>
          <input type="text" name='otp' value={otp} onChange={(e) => setOtp(e.target.value)} />
          <label htmlFor="newPassword">New Password:</label>
          <input type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button className='btn reset-btn' type='submit'>Reset Password</button>
          {error && <p style={{ color: 'white', textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
 );
};

export default PasswordReset;
