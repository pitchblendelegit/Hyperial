import React from 'react'
import './Admin.css'
import Sidebar from './../../components/sidebar/Sidebar';
import {Routes, Route } from 'react-router-dom';
import Dashboard from './../../components/dashboard/Dashboard';
import Inventory from './../../components/inventory/Inventory';
import UserManagement from './../../components/userManagement/UserManagement';
import Report from './../../components/report/Report';
import Project from './../../components/project/Project';
import Request from './../../components/request/Request';
import Procurement from './../../components/procurement/Procurement';

const Admin = () => {
  return (
    <div className='Admin'>
        <Sidebar/>
        <Routes>
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/inventory' element={<Inventory/>} />
          <Route path='/userManagement' element={<UserManagement/>} />
          <Route path='/request' element={<Request/>} />
          <Route path='/report' element={<Report/>} />
          <Route path='/project' element={<Project/>} />
          <Route path='/procurement' element={<Procurement/>} />
        </Routes>
    </div>
  )
}

export default Admin