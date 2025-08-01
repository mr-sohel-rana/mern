import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext"; // Import the context
import Layout from "../components/layout/Layout";
import Usermenu from "./UserMenu";

const Profile = () => {
  const [auth] = useAuth(); // Access the auth context
  const [userData, setUserData] = useState(auth?.user || null); // Initial state from auth context
  const [imageError, setImageError] = useState(false); // To track image load errors

  // Whenever the auth context changes, update userData
  console.log(auth?.user)
  useEffect(() => {
    const fetchUser = async () => {
      if (auth?.user?._id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/single-user/${auth.user._id}`);
          setUserData(response.data.user); // Update userData with latest data from the server
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [auth?.user]); // Dependency on auth.user ensures this runs on updates

  // Fallback image if the profile image fails to load
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle loading state when no userData is available
  if (!userData) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Usermenu />
          </div>
          <div className="col-md-9">
            <h1>{userData?.name ? `${userData.name}'s Profile` : 'Loading profile...'}</h1>
            <img
              style={{ height: '120px', width: '120px', borderRadius: '50%' }}
              src={imageError ? '/path/to/default-image.jpg' : `http://localhost:5000/api/v1/single-image/${auth?.user?._id}`}
              alt="Profile"
              onError={handleImageError} // If image fails to load, fallback to a default image
            />
            <h4>Name: {userData?.name}</h4>
            <h4>Email: {userData?.email}</h4>
            <h4>Player: {userData?.player}</h4>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
