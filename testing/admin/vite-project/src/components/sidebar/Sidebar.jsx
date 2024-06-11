import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='Sidebar'>
        <Link to={'/dashboard'} style = {{textDecoration:"none"}}> 
            <div className='sidebarItem'>
                Dashboard
            </div>
        </Link>
        <Link to={'/inventory'} style = {{textDecoration:"none"}}>
            <div className='sidebarItem'>
                Inventory
            </div>
        </Link>
        <Link to={'/userManagement'} style = {{textDecoration:"none"}}>
            <div className='sidebarItem'>
                User Management
            </div>
        </Link>
        <Link to={'/request'} style = {{textDecoration:"none"}}> 
            <div className='sidebarItem'>
                Request
            </div>
        </Link>
        <Link to={'/report'} style = {{textDecoration:"none"}}>
            <div className='sidebarItem'>
                Report
            </div>
        </Link>
        <Link to={'/procurement'} style = {{textDecoration:"none"}}>
        <div className='sidebarItem'>
            Procurement
        </div>
        </Link>
        <Link to={'/project'} style = {{textDecoration:"none"}}>
        <div className='sidebarItem'>
            Project
        </div>
        </Link>
        <div className='sidebarItem'>
            Logout
        </div>
    </div>
  )
}

export default Sidebar