import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {useAuth} from '../context/authContext'

const AdminMenus = () => {
  const [auth]=useAuth();
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <ul className="list-group">
            <li className="list-group-item bg-dark text-white">Admin Panel</li>
            <li className="list-group-item">
              <NavLink 
                to="/dashboard/admin/profile" 
                className={({ isActive }) => (isActive ? 'text-decoration-none active' : 'text-decoration-none')}
              >
              Profile
              </NavLink>
            </li>
            <li> 
            <NavLink to={`/dashboard/admin/update/${auth?.user?._id}`} className={({ isActive }) => (isActive ? 'text-decoration-none active' : 'text-decoration-none')}>
                    Update
            </NavLink>
            </li>
            <li className="list-group-item">
              <NavLink 
                to="/dashboard/admin/create-category" 
                className={({ isActive }) => (isActive ? 'text-decoration-none active' : 'text-decoration-none')}
              >
                Create Category
              </NavLink>
            </li>
            <li className="list-group-item">
              <NavLink 
                to="/dashboard/admin/create-product" 
                className={({ isActive }) => (isActive ? 'text-decoration-none active' : 'text-decoration-none')}
              >
                create product
              </NavLink>
            </li>
            <li className="list-group-item">
              <NavLink 
                to="/dashboard/admin/products" 
                className={({ isActive }) => (isActive ? 'text-decoration-none active' : 'text-decoration-none')}
              >
                products
              </NavLink>
            </li>
            <li className="list-group-item">
              <NavLink 
                to="/dashboard/admin/orders" 
                className={({ isActive }) => (isActive ? 'text-decoration-none active' : 'text-decoration-none')}
              >
                Orders
              </NavLink>
            </li>
             
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminMenus;
