import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    shipping: false,
    photos: [], // Ensure photos is always an array
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/v1/single-product/${id}`);
      if (data.status === 'success') {
        setProduct({
          ...data.product,
          shipping: data.product.shipping || false,
          photos: data.product.photos || [], // Set photos using photos field
        });
      } else {
        toast.error('Failed to load product');
      }
    } catch (error) {
      toast.error('Error fetching product details');
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/v1/allcategory');
      if (data.status === 'success') {
        setCategories(data.allCategory);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === 'checkbox' ? checked : value });
  };

  // Handle image changes
  const handleImageChange = (e, index) => {
    const newPhotos = [...product.photos];
    newPhotos[index] = e.target.files[0]; // Update the image at the specific index
    setProduct({ ...product, photos: newPhotos });
  };

  // Handle image removal
  const handleImageRemove = (index) => {
    const newPhotos = product.photos.filter((_, i) => i !== index);
    setProduct({ ...product, photos: newPhotos });
    deleteImageFromServer(product.photos[index]);  // Call function to remove image from server
  };

  // Function to delete image from server
  const deleteImageFromServer = async (imageName) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/delete-image`, {
        data: { imageName },
      });
      if (response.data.status === 'success') {
        toast.success('Image deleted successfully');
      } else {
        toast.error('Failed to delete image from server');
      }
    } catch (error) {
      toast.error('Error deleting image');
    }
  };

  // Handle product update
  const updateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('quantity', product.quantity);
    formData.append('shipping', product.shipping);

    // Append photos to FormData
    product.photos.forEach((photo, index) => {
      if (photo) {
        formData.append(`photo${index + 1}`, photo); // Append photo1, photo2, etc.
      }
    });

    try {
      const response = await axios.put(`http://localhost:5000/api/v1/product-update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status === 'success') {
        toast.success('Product updated successfully');
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('Error updating product');
    }
    setIsLoading(false);
  };

  // Handle delete product
  const deleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/v1/product-delete/${id}`);
        if (response.data.status === 'success') {
          toast.success('Product deleted successfully');
          navigate('/dashboard/admin/products'); // Redirect to the products list
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="text-center">Edit Product</h2>
        <form onSubmit={updateProduct} className="p-4 border rounded bg-light shadow">
          {/* Product Name */}
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input type="text" name="name" className="form-control" value={product.name} onChange={handleInputChange} required />
          </div>

          {/* Product Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" value={product.description} onChange={handleInputChange} rows="4" required />
          </div>

          {/* Product Price */}
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" name="price" className="form-control" value={product.price} onChange={handleInputChange} required />
          </div>

          {/* Product Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select name="category" className="form-control" value={product.category} onChange={handleInputChange} required>
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
            <input type="number" name="quantity" className="form-control" value={product.quantity} onChange={handleInputChange} required />
          </div>

          {/* Shipping */}
          <div className="mb-3">
            <label className="form-label">Shipping</label>
            <input type="checkbox" name="shipping" className="form-check-input" checked={product.shipping} onChange={handleInputChange} />
          </div>

          {/* Image Uploads */}
          <div className="mb-3">
            {product.photos && Array.isArray(product.photos) && product.photos.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {product.photos.map((photo, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={photo ? `http://localhost:5000/uploads/${photo}` : ''}
                      alt={`Product ${index + 1}`}
                      className="img-thumbnail"
                      width="100"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      onClick={() => handleImageRemove(index)}
                    >
                      X
                    </button>
                    <input
                      type="file"
                      className="form-control mt-2"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </div>
                ))}
                {/* Add extra fields if there are less than 5 photos */}
                {product.photos.length < 5 && (
                  <div className="mt-2">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleImageChange(e, product.photos.length)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Update Button */}
          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Product'}
          </button>
          {/* Delete Button */}
          <button type="button" className="btn btn-danger w-100 mt-3" onClick={deleteProduct}>
            Delete Product
          </button>
        </form>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default ProductDetails;
