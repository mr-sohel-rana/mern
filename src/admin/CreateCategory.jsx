import React, { useState, useEffect } from 'react';
import AdminMenus from './AdminMenu';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null); // Store category ID for editing

  // Fetch all categories
  const allCategory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/v1/allcategory');

      if (data.status === 'success') {
        // Directly accessing allCategory array from the response
        setCategories(data.allCategory || []); // Default to empty array if no categories
        toast.success('Categories Fetched Successfully');
      } else {
        toast.error(data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      toast.error('Something went wrong!');
      setCategories([]); // Ensure categories is an empty array on error
    }
  };

  useEffect(() => {
    allCategory();
  }, []);

  // Create or Update Category
  const submitHandle = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('categoryName', name);
    if (photo) formData.append('categoryPhoto', photo);

    try {
      let response;
      if (editId) {
        // Update category
        response = await axios.put(`http://localhost:5000/api/v1/update-category/${editId}`, formData);
        toast.success('Category Updated Successfully');
      } else {
        // Create category
        console.log(formData)
        response = await axios.post('http://localhost:5000/api/v1/create-category', formData);
        toast.success('Category Created Successfully');
      }

      if (response.data.status === 'success') {
        setName('');
        setPhoto(null);
        setEditId(null);
        allCategory(); // Fetch updated categories list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  // Handle Delete
  const handleDelete = async (cat) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/delete-category/${cat._id}`);
      toast.success('Category Deleted Successfully');
      allCategory(); // Refresh categories list after deletion
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  // Handle Edit
  const handleEdit = (cat) => {
    setName(cat.categoryName);
    setEditId(cat._id);
  };

  return (
    <Layout className="container">
      <div className="row">
        <div className="md-col-3">
          <AdminMenus />
        </div>
        <div className="md-col-9 text-center">
          <h1>{editId ? 'Edit Category' : 'Create Category'}</h1>
          <form
            onSubmit={submitHandle}
            style={{ maxWidth: '300px', margin: '0 auto', paddingTop: '10px', background: 'gray' }}
          >
            {/* Name Field */}
            <div className="mb-3">
              <input
                name="name"
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                    onClick={() => setPhoto(null)}
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {editId ? 'Update' : 'Submit'}
            </button>
          </form>

          {/* Display Categories */}
          <h2 className="mt-4">All Categories</h2>
          {categories && categories.length > 0 ? (
            categories.map((cat, i) => (
              <div key={i} className="p-2 border d-flex align-items-center gap-3">
                <img
                  src={`http://localhost:5000/api/v1/categoryimage/${cat._id}`}
                  alt={cat.categoryName}
                  className="img-fluid"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <p className="mb-0">{cat.categoryName}</p>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat)}>
                  Delete
                </button>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(cat)}>
                  Edit
                </button>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}

          <ToastContainer />
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
