import React from 'react'
import Usermenu from './UserMenu'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/authContext'
const Profile = () => {
  const [auth]=useAuth();
  return (
    <Layout>
    <div className="container">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <Usermenu />
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <h1>{auth?.user?.name} profile</h1>
           <h4>Name : {auth?.user?.name}</h4>
           <h4>Email : {auth?.user?.email}</h4>
           <h4>Phone : {auth?.user?.phone}</h4>
           <h4>Address : {auth?.user?.address}</h4>
          
        </div>
      </div>
    </div>
  </Layout>
  )
}

export default Profile