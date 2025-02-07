import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Usermenu = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <ul className="list-group">
            <li className="list-group-item bg-dark text-white">User Panel</li>
            <li className="list-group-item">
              <NavLink 
                to="/dashboard/user/profile" 
                className={({ isActive }) => (isActive ? 'text-decoration-none active' : 'text-decoration-none')}
              >
              Profile
              </NavLink>
            </li>
            <li className="list-group-item">
              <NavLink 
                to="/dashboard/user/order" 
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

export default Usermenu;
