/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useDispatch } from 'react-redux'
import { adminLogout } from '../../../Redux/Slice/authSlice'
import { useNavigate, useLocation } from 'react-router-dom';



function AdminNavbar() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()


    const handleLogout = ()=>{
        dispatch(adminLogout())
        navigate('/admin')
    }
  return (

    
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Navbar Brand */}
          <div className="text-white font-bold text-xl">Admin Panel</div>

          {/* Navbar Links */}
          <div className="space-x-4">
            <NavLink to="/adminhome" currentPath={location.pathname}>
              Home
            </NavLink>
            <NavLink to="/userslist" currentPath={location.pathname}>
              Users
            </NavLink>
            <NavLink to="/postlist" currentPath={location.pathname}>
              Posts
            </NavLink>
            <NavLink to="/reports" currentPath={location.pathname}>
              Reports
            </NavLink>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} className="text-white hover:text-gray-300">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

const NavLink = ({ to, currentPath, children }) => {
  const isActive = currentPath.includes(to);

  return (
    <a href={to} className={`text-white hover:text-gray-300 ${isActive ? 'font-bold' : ''}`}>
      {children}
    </a>
  );
};


export default AdminNavbar