import React from 'react';
import logo from '../../assets/banner/logo.jpg';
import { Link } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
const Navbar = () => {
  return (
    <div className="   mx-auto p-3 shadow-md">
      <header className="flex text-center items-center justify-between space-x-5 ">
        <div>
          <img className="h-16 w-16" src={logo} alt="Logo" />
        </div>

        <form className="flex items-center  bg-blue-500 p-2 rounded-xl w-full max-w-md mx-auto">
  <input 
    className="w-full h-6 px-2 text-sm outline-none rounded-l-md"
    type="search" 
    placeholder="Search..." 
  />
  <button type='submit'><IoSearchSharp className="text-white text-3xl p-1 cursor-pointer" /></button>
</form>


        <nav>
          <ul className="flex space-x-3 ">
          <li>
              <Link to="/" className="text-blue-700   md:hover:border-b-2 md:hover:border-blue-700    lg:hover:text-blue-700" ><FaUserCircle className="text-2xl" /></Link>
            </li>

            <li className="relative">
  <Link to="/" className="text-blue-700 md:hover:border-b-2 md:hover:border-blue-700 lg:hover:text-blue-700">
    <FaCartShopping className="text-2xl" />
    <span className="absolute left-2 top-[-18px] right-0 inline-block bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      3
    </span>
  </Link>
</li>

 
            <li>
              <Link to="/register" className=" text-white   bg-blue-700  lg:hover:shadow-xl p-1 rounded-lg  "    >Register</Link>
            </li>
            <li>
              <Link to="/login" className=" text-white   bg-blue-700  lg:hover:shadow-xl p-1 rounded-lg  "    >login</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
