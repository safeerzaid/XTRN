import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const INITIAL_STATE = {
  name: '',
  brand: '',
  description: '',
  price: '',
  originalPrice: '',
  gender: 'unisex',
  department: [],
  section: '',
  category: '',
  subcategory: '',
  sport: '',
  sizes: '',
  stock: 0,
  discount: 0,
  images: ''
};

const DEPARTMENTS = ['men', 'women', 'sports', 'accessories'];

const ProductFormModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        sizes: product.sizes?.join(', ') || '',
        images: product.images?.default?.join(', ') || '',
        originalPrice: product.originalPrice || '',
        discount: product.discount || 0,
        stock: product.stock || 0
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      price: formData.price === '' ? undefined : Number(formData.price),
      originalPrice: formData.originalPrice === '' ? undefined : Number(formData.originalPrice),
      discount: formData.discount === '' ? undefined : Number(formData.discount),
      stock: formData.stock === '' ? undefined : Number(formData.stock),
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      images: {
        default: formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : []
      }
    };

    try {
      if (product) {
        await api.put(`/products/${product._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input type="text" name="brand" required value={formData.brand} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" rows="3"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Original Price (optional)</label>
              <input type="number" name="originalPrice" min="0" value={formData.originalPrice} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount %</label>
              <input type="number" name="discount" min="0" max="100" value={formData.discount} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <div className="flex flex-wrap gap-4 border p-2 rounded bg-gray-50 min-h-[42px] items-center">
                {DEPARTMENTS.map(dept => (
                  <label key={dept} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="department"
                      value={dept}
                      checked={formData.department?.includes(dept) || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData(prev => {
                          const current = prev.department || [];
                          if (checked) {
                            return { ...prev, department: [...current, dept] };
                          } else {
                            return { ...prev, department: current.filter(d => d !== dept) };
                          }
                        });
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="capitalize text-sm text-gray-700">{dept}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <input type="text" name="section" value={formData.section} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <input type="text" name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sport</label>
              <input type="text" name="sport" value={formData.sport} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
              <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Images (comma separated URLs)</label>
              <input type="text" name="images" value={formData.images} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-200 gap-3 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
