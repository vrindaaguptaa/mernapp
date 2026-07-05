import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { buildApiUrl, parseApiResponse } from '../utils/api';

export default function AdminFood() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    img: '',
    CategoryName: '',
    rating: 4.5,
    options: [{ Half: 200, Full: 400 }]
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFoods();
    fetchCategories();
  }, [token, navigate]);

  const fetchFoods = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/admin/foods'), {
        headers: { 'auth-token': token }
      });
      const json = await parseApiResponse(res, 'Failed to load foods');
      if (!json?.success) throw new Error(json?.message || 'Failed to load foods');
      setFoods(json.foods || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/admin/categories'), {
        headers: { 'auth-token': token }
      });
      const json = await parseApiResponse(res, 'Failed to load categories');
      if (json?.success) setCategories(json.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? buildApiUrl(`/api/admin/editFood/${editingId}`) : buildApiUrl('/api/admin/addFood');

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(formData)
      });

      const json = await parseApiResponse(res, 'Operation failed');
      if (!json?.success) throw new Error(json?.message || 'Operation failed');

      toast.success(editingId ? 'Food updated' : 'Food added');
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        img: '',
        CategoryName: '',
        rating: 4.5,
        options: [{ Half: 200, Full: 400 }]
      });
      fetchFoods();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      const res = await fetch(buildApiUrl(`/api/admin/deleteFood/${id}`), {
        method: 'DELETE',
        headers: { 'auth-token': token }
      });
      const json = await parseApiResponse(res, 'Failed to delete food');
      if (!json?.success) throw new Error(json?.message || 'Failed to delete food');
      toast.success('Food deleted');
      fetchFoods();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      name: food.name,
      description: food.description || '',
      img: food.img || '',
      CategoryName: food.CategoryName,
      rating: food.rating || 4.5,
      options: food.options || [{ Half: 200, Full: 400 }]
    });
    setShowForm(true);
  };

  if (loading) return <div className="container py-5 text-center">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Foods</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              img: '',
              CategoryName: '',
              rating: 4.5,
              options: [{ Half: 200, Full: 400 }]
            });
          }}
        >
          {showForm ? 'Cancel' : '+ Add Food'}
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            <h5 className="mb-4">{editingId ? 'Edit Food' : 'Add New Food'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Food Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    name="CategoryName"
                    value={formData.CategoryName}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.CategoryName}>
                        {cat.CategoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="img"
                    value={formData.img}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success">
                {editingId ? 'Update' : 'Add'} Food
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id}>
                <td>{food.name}</td>
                <td>{food.CategoryName}</td>
                <td>{food.rating || '4.5'} ⭐</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(food)}
                  >
                    <Edit fontSize="small" />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(food._id)}
                  >
                    <Delete fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
