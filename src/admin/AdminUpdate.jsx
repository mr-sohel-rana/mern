import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/authContext";
import AdminMenus from "./AdminMenu";

const AdminUpdate = () => {
  const { userId } = useParams(); // Access the userId from the route params
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth(); // Accessing auth context and setAuth function
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    player: "",
  });
  const [photo, setPhoto] = useState(null); // State for new photo upload
  const [currentProfileImage, setCurrentProfileImage] = useState(""); // State for current profile image

  // Fetch user data when component mounts or userId changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/single-user/${auth?.user?._id}`);
        const user = response.data.user || {};
         

        // Set form data with fallback values if fields are undefined
        setFormData({
          name: user.name || "", // Default to empty string if name is undefined
          email: user.email || "",
          player: user.player || "",
        });

        // Set current profile image or fallback to a placeholder if undefined
        setCurrentProfileImage(user.photo || "");
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching user");
      }
    };

    if (userId) {
      fetchUser(); // Fetch user data when userId is available
    }
  }, [userId]);

  // Handle changes in the input fields (name, email, player)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle photo file selection
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]); // Set the selected photo in state
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]); // Append form data
    });

    if (photo) {
      formDataToSend.append("photo", photo); // Append photo if there is one
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/updateUser/${auth?.user?._id||req.user._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      toast.success(response.data.message || "User updated successfully");

      // Update profile image immediately if photo is selected
      if (photo) {
        setCurrentProfileImage(URL.createObjectURL(photo)); // Update profile image with selected photo
      }

      // Update auth context with new user data after successful update
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: response.data.user || prevAuth.user, // Update user in auth context
      }));

      // Redirect to profile page after successful update
      navigate("/dashboard/admin/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating user");
    }
  };

  return (
    <Layout className="container">
        <div className="row">

        <div className="md-col-4">
    <AdminMenus />
   </div>
   <div className="md-col-8">
   <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "300px",
          margin: "0 auto",
          paddingTop: "10px",
          background: "gray",
        }}
      >
        {/* Display profile image */}
        <div className="mb-3">
          <img
            src={
              photo
                ? URL.createObjectURL(photo) // Show uploaded photo
                : currentProfileImage || `http://localhost:5000/api/v1/single-image/${auth?.user?._id}` // Show current or default profile image
            }
            alt="Profile"
            style={{ height: "120px", width: "120px", borderRadius: "50%" }}
          />
        </div>

        {/* Name input field */}
        <div className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter your name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email input field */}
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Player input field */}
        <div className="mb-3">
          <input
            type="text"
            name="player"
            className="form-control"
            placeholder="Favorite player name"
            value={formData.player || ""}
            onChange={handleChange}
          />
        </div>

        {/* File input field for photo */}
        <div className="mb-3">
          <label htmlFor="product-photo" className="btn btn-primary">
            {photo ? photo.name : "Upload Photo"}
          </label>
          <input
            type="file"
            id="product-photo"
            className="form-control d-none"
            accept="image/*"
            onChange={handleFileChange}
          />
          {photo && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(photo)}
                alt="Product"
                className="img-thumbnail"
                style={{ height: "200px", width: "200px" }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm mt-2"
                onClick={() => setPhoto(null)} // Remove selected photo
              >
                Remove Photo
              </button>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="mb-3">
          <button className="btn btn-success" type="submit">
            Update User
          </button>
        </div>
      </form>

      {/* Toast notifications */}
      <ToastContainer />
   </div>
        </div>
    </Layout>
  );
};

export default AdminUpdate;
