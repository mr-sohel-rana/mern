import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    shipping: false,
    images: [null, null, null, null, null], // 5 Image slots
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all categories
  const allCategory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/v1/allcategory');
      if (data.status === 'success') {
        setCategories(data.allCategory || []);
        toast.success('Categories Fetched Successfully');
      } else {
        toast.error(data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      toast.error('Something went wrong!');
      setCategories([]);
    }
  };

  useEffect(() => {
    allCategory();
  }, []);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle Image Change
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }
    const updatedImages = [...formData.images];
    updatedImages[index] = file;
    setFormData({ ...formData, images: updatedImages });
  };

  // Handle Image Remove
  const handleImageRemove = (index) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = null;
    setFormData({ ...formData, images: updatedImages });
  };

  // Submit Handler
  const submitHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate fields
    const { name, description, price, category, quantity, images } = formData;
    if (!name || !description || !price || !category || !quantity) {
      toast.error('All fields are required!');
      setIsLoading(false);
      return;
    }

    if (price <= 0 || quantity <= 0) {
      toast.error('Price and quantity must be positive numbers.');
      setIsLoading(false);
      return;
    }

    if (images.every((image) => !image)) {
      toast.error('Please upload at least one image.');
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('description', description);
    formDataToSend.append('price', price);
    formDataToSend.append('category', category);
    formDataToSend.append('quantity', quantity);
    formDataToSend.append('shipping', formData.shipping);

    images.forEach((image, index) => {
      if (image) {
        formDataToSend.append(`photo${index + 1}`, image);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/v1/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        toast.success('Product Created Successfully');
        navigate('/dashboard/admin/products')
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating product:', error.response || error);
      toast.error('Something went wrong! Please try again.');
    }
    setIsLoading(false);  // Ensure to reset loading state
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="text-center mb-4">Create Product</h2>
            <form onSubmit={submitHandle} className="p-4 border rounded bg-light shadow">
              {/* Product Name */}
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Product Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              {/* Product Price */}
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Product Category */}
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Quantity */}
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Shipping */}
              <div className="mb-3">
                <label className="form-label">Shipping</label>
                <input
                  type="checkbox"
                  name="shipping"
                  className="form-check-input"
                  checked={formData.shipping}
                  onChange={handleInputChange}
                />
              </div>

              {/* Image Uploads */}
              <div className="mb-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="d-flex mb-2">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    {image && (
                      <button
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => handleImageRemove(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Product'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </Layout>
  );
};

export default CreateProduct;