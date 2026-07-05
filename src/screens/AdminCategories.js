import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { buildApiUrl, parseApiResponse } from '../utils/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');


  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(buildApiUrl('/api/admin/categories'), {
        headers: { 'auth-token': token }
      });
      const json = await parseApiResponse(res, 'Failed to load categories');
      if (!json?.success) throw new Error(json?.message || 'Failed to load categories');
      setCategories(json.categories || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [token, navigate, fetchCategories]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId
        ? buildApiUrl(`/api/admin/editCategory/${editingId}`)
        : buildApiUrl('/api/admin/addCategory');

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ CategoryName: categoryName })
      });

      const json = await parseApiResponse(res, 'Operation failed');
      if (!json?.success) throw new Error(json?.message || 'Operation failed');

      toast.success(editingId ? 'Category updated' : 'Category added');
      setShowForm(false);
      setEditingId(null);
      setCategoryName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Foods in this category will still exist.')) return;
    try {
      const res = await fetch(buildApiUrl(`/api/admin/deleteCategory/${id}`), {
        method: 'DELETE',
        headers: { 'auth-token': token }
      });
      const json = await parseApiResponse(res, 'Failed to delete category');
      if (!json?.success) throw new Error(json?.message || 'Failed to delete category');
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setCategoryName(cat.CategoryName);
    setShowForm(true);
  };

  if (loading) return <div className="container py-5 text-center">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Categories</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setCategoryName('');
          }}
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            <h5 className="mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Biryani, Desserts, Beverages"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update' : 'Add'} Category
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row g-4">
        {categories.map((cat) => (
          <div key={cat._id} className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{cat.CategoryName}</h5>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary flex-grow-1"
                    onClick={() => handleEdit(cat)}
                  >
                    <Edit fontSize="small" /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger flex-grow-1"
                    onClick={() => handleDelete(cat._id)}
                  >
                    <Delete fontSize="small" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !showForm && (
        <div className="text-center py-5 text-muted">No categories yet. Add one to get started.</div>
      )}
    </div>
  );
}
