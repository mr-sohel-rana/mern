import { useState } from 'react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [player, setPlayer] = useState('');
  const [photo, setPhoto] = useState(null);

  const submitHandle = async (e) => {
    e.preventDefault();
    const formData = new FormData(); 
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('player', player);
    formData.append('photo', photo);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/register', formData);
      if (response.data.status === 'success') {
        toast.success('Registered Successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <Layout>
      <form
        onSubmit={submitHandle}
        style={{ maxWidth: '300px', margin: '0 auto', paddingTop: '10px', background: 'gray' }}
      >
        {/* Name Field */}
        <div className="mb-10">
          <input
            name="name"
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="form-text">We'll never share your email with anyone else.</div>
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Player Name Field */}
        <div className="mb-3">
          <input
            name="player"
            type="text"
            className="form-control"
            placeholder="Favorite player name"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
          />
        </div>

        {/* Photo Upload */}
        <div className="mb-3">
          <label htmlFor="product-photo" className="btn btn-primary">
            {photo ? photo.name : 'Upload Photo'}
          </label>
          <input
            type="file"
            id="product-photo"
            className="form-control d-none"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          {photo && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(photo)}
                alt="product"
                className="img-thumbnail"
                style={{ height: '200px', width: '200px' }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm mt-2"
                onClick={() => setPhoto(null)} // ✅ Corrected
              >
                Remove Photo
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Submit
        </button>
      </form>

      {/* ToastContainer should be placed outside the form */}
      <ToastContainer />
    </Layout>
  );
};

export default Register;
