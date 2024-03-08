import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogin,  } from '../../../Redux/Slice/authSlice';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/socialadmin/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email:username,
          password,
        }),
      });
  
  
      const data = await response.json();
      console.log(data.error);
      setError(data.error)
  
      switch (data.error) {
        case 'Both email and password required':
        case 'Incorrect Password':
        case 'Admin Access is required':
          setError(data.error);
          break;
  
        default:
          if (!data.error) {
            console.log('Loginnnn');
            dispatch(adminLogin(data))
            navigate('/adminhome');
          }
          break;
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <h2 className="text-2xl font-bold text-white mb-5">Admin Login</h2>
        <form className="space-y-5 max-w-md w-full" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white font-bold mb-2" htmlFor="username">
              Username:
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
  
          <div>
            <label className="block text-white font-bold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
  
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-auto flex items-center">
            Sign in
          </button>
        </form>
      </div>
   );
  };
  


export default AdminLogin;
