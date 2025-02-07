import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Assuming auth context is in context folder
import axios from 'axios';

const PrivateRoutes = () => {
  const [ok, setOk] = useState(null); // Track whether the user is authenticated
  const [auth] = useAuth(); // Access the auth context

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/v1/user-auth', {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        setOk(data.ok); // Set authentication status based on the response
      } catch {
        setOk(false); // If the request fails, assume not authenticated
      }
    };

    if (auth?.token) {
      checkAuth();
    } else {
      setOk(false);
    }
  }, [auth?.token]);

  if (ok === null) return <div>Loading...</div>; // Show loading while auth status is being checked

  return ok ? <Outlet /> : <Navigate to="/login" />; // Render based on authentication status
};

export default PrivateRoutes;
