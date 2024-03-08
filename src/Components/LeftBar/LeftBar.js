/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import "./leftbar.css";
import { BASE_URL } from "../../Api/api";
import Message from "../Message/Message";
import { useMediaQuery } from 'react-responsive';

export default function LeftBar() {
 const CurrentUser = useSelector((state) => state.auth.user);
 const isMobile = useMediaQuery({ query: '(max-width: 768px)' }); 

 const [isVisible, setIsVisible] = useState(true);

 const toggleVisibility = () => {
  if (isMobile) { 
    setIsVisible(!isVisible);
  }
};

if (!isVisible) {
  return null; 
}

 return (
    <div className="leftBar">
      <div className="left-container">
        <div className="menu">
          <Link to="/home/profile">
            <div
              style={{ marginBottom: "10px", marginLeft: "10px" }}
              className="user"
            >
              {CurrentUser && CurrentUser.user_profile ? (
                <img
                 src={`${BASE_URL}${CurrentUser.user_profile.profile_image}`}
                 alt="Profile Image"
                 className="profile-image" 
                />
              ) : null}
              
              {CurrentUser && CurrentUser.user && CurrentUser.user.username ? (
                <h4 style={{ marginLeft: "10px" }}> {CurrentUser.user.username}</h4>
              ) : null}
            </div>
          </Link>
          <Message toggleVisibility={toggleVisibility}/>
        </div>
      </div>
    </div>
 );
}
