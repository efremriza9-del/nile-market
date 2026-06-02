import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import API from '../utils/api';
import toast from 'react-hot-toast';
import './PostProductPage.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Food & Groceries', 'Home & Garden', 'Beauty', 'Sports', 'Books', 'Other'];

export default function PostProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) return toast.error('Max 5 images');
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error('Please add at least one image');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      images.forEach(img => data.append('images', img));
      await API.post('/api/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product posted successfully!');
      navigate('/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error posting product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container post-container">
        <div className="post-header">
          <h1>Post a Product</h1>
          <p>Fill in the details to list your product on Nile Market</p>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          {/* Image Upload */}
          <div className="form-section">
            <h3><FiImage /> Product Images <span>(up to 5)</span></h3>
            <div className="image-upload-area">
              {previews.map((src, i) => (
                <div key={i} className="img-preview">
                  <img src={src} alt="" />
                  <button type="button" className="remove-img" onClick={() => removeImage(i)}><FiX /></button>
                  {i === 0 && <span className="main-badge">Main</span>}
                </div>
              ))}
              {images.length < 5 && (
                <label className="upload-btn">
                  <FiUpload size={24} />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" multiple onChange={handleImages} hidden />
                </label>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="form-section">
            <h3>Product Details</h3>
            <div className="form-grid">
              <div className="form-group full">
                <label>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Samsung Galaxy S23" required />
              </div>
              <div className="form-group full">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product..." required rows={4} />
              </div>
              <div className="form-group">
                <label>Price (ETB) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0" min="0" required />
              </div>
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" min="0" required />
              </div>
              <div className="form-group full">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? 'Posting...' : '🚀 Post Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
