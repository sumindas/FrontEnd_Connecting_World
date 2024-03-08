/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const admin_token = useSelector((state)=>state.auth.admin_token)
  console.log("AdminToken:",admin_token)
  const navigate = useNavigate()

  useEffect(()=>{
    if(!admin_token){
      navigate('/admin')
    }
  })

  return (
        <>
        <AdminNavbar />
        </>
     
  );
}
