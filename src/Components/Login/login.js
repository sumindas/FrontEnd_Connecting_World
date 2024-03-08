import React, { useEffect, useState } from 'react';
import './login.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../Redux/Actions/authActions';
import { setResetEmail, setToken } from '../../Redux/Slice/authSlice';
import axios from 'axios';
import { BASE_URL } from '../../Api/api';

function Login() {
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const [email, setEmail] = useState('');
 const error = useSelector((state) => state.auth.error);
 const [password, setPassword] = useState('');
 const token = useSelector((state) => state.auth.token);
 const [showModal, setShowModal] = useState(false); 
 const [modalEmail, setModalEmail] = useState(''); 

 useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("storedToken:", storedToken);
    if (storedToken) {
      dispatch(setToken(storedToken));
    }
    if (token) {
      navigate('/home/profile');
    } else {
      navigate('/');
    }
 }, [token, navigate, dispatch]);

 const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
 };

 const handleForgotPassword = (event) => {
    event.preventDefault()
    setShowModal(true); 
 };

 const handleModalSubmit = async () => {
  if (!modalEmail) {
      alert("Please enter your email.");
      return;
  }

  try {
      const response = await axios.post(`${BASE_URL}/forget-password/`, {
          email: modalEmail
      });
      console.log("API Response:", response);

      if (response.status === 200){
        console.log("Response Data:", response.data)
        console.log(response.data);
        alert(response.data.message);
        dispatch(setResetEmail(modalEmail));
        setEmail('')
        setShowModal(false);
        navigate('/resetpassword') 
      } 
      else{
        alert("Something Went wrong...Try Again!!!")
      }
  } catch (error) {
      console.error('There was a problem with your axios operation:', error);
      alert('Failed to send OTP. Please try again.');
  }
};

 return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h2>-<br />Connecting World <br />-</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
          <span>Don't Have an Account?</span>
          <Link to='/signup'>
            <button className='btn btn-primary'>Register</button>
          </Link>
        </div>
        <form className='right' onSubmit={handleLogin}>
          <input
            type="text"
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={{ color: 'white' }}>{error}</p>}
          <button className='btn login-btn' type='submit'>Login</button>
          <button className='btn login-btn' onClick={(event) => handleForgotPassword(event)}>Forgot Password?</button>
        </form>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Forgot Password</h2>
            <p>Enter your Registered Email to Receive an OTP.</p>
            <input
              type="email"
              placeholder='Email'
              value={modalEmail}
              onChange={(e) => setModalEmail(e.target.value)}
            />
            <button className='btn modal-btn' onClick={handleModalSubmit}>Send OTP</button>
            <button className='btn modal-btn' onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
 );
}

export default Login;
