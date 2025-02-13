import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import img from '../assets/banner/signin.gif';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        console.log("Login submitted");
        console.log(email, password);
    };

    return (
        <Layout>
            <div className="container mx-auto border-4 border-blue-600 w-72 h-96 p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center">
                <div className="mx-auto text-center">
                    <img className="mx-auto mt-1 mb-3 w-24 h-24 rounded-full" src={img} alt="User avatar" />
                </div>

                <form onSubmit={handleSubmit} className="text-center">
                    {/* Email Input */}
                    <div className="mb-3">
                        <label htmlFor="email" className="block text-md font-medium text-gray-700">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            name="email"
                            placeholder="Email..."
                            className="bg-white h-9 w-full px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                        <label htmlFor="password" className="block text-md font-medium text-gray-700">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            name="password"
                            placeholder="Password..."
                            className="bg-white h-9 w-full px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                        />
                    </div>
                    <p className="text-sm text-blue-600 hover:underline mt-[-15px]  mb-3 text-right">
  <Link to="/forgot-password">Forgot password?</Link>
</p>


                    {/* Login Button */}
                    <button
                        className="bg-blue-500 text-white w-full py-1 text-lg rounded-md hover:bg-blue-600 transition"
                        type="submit"
                    >
                        Login
                    </button>
                </form>

                {/* Signup Link */}
                <p className="text-center mx-auto p-2 text-blue-400 text-sm">
                    Don't have an account?{" "}
                    <Link to="/register">
                        <span className="font-bold text-red-600 hover:underline">Sign Up</span>
                    </Link>
                </p>
            </div>
        </Layout>
    );
};

export default Login;
