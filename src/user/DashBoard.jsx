import React from 'react';
import Layout from '../components/layout/Layout';
 
import { useAuth } from '../context/authContext';
import Usermenu from './UserMenu';

const  Dashboard = () => {
    const [auth]=useAuth();
  return (
    <Layout>
      <div className="container">
        <div className="row">
          {/* Admin Menu Sidebar (3 columns) */}
          <div className="col-md-3">
            <Usermenu />
          </div>
          
          {/* Main Content (9 columns) */}
          <div className="col-md-9">
            <h1>User Dashboard</h1>
            <div className="cart">
            <h3> Name:{auth?.user?.name}</h3>
            <h3> Email:{auth?.user?.email}</h3>
            <h3>Phone:{auth?.user?.phone}</h3>
            </div>
             
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default  Dashboard;
