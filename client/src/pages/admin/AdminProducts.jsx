import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProductFormModal from '../../components/admin/ProductFormModal';
import { formatPrice } from '../../utils/formatPrice';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(prev => prev.filter(p => p._id !== id));
      } catch (error) {
        console.error('Failed to delete product', error);
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors font-medium">
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-3 text-sm font-semibold text-gray-600 rounded-tl-md">Image</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Category</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Price</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Stock</th>
                <th className="p-3 text-sm font-semibold text-gray-600 rounded-tr-md">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    {product.images?.default?.[0] ? (
                      <img src={product.images.default[0]} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">N/A</div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{product.name}</td>
                  <td className="p-3 text-gray-600">{product.category || '-'}</td>
                  <td className="p-3 text-gray-600">{formatPrice(product.price)}</td>
                  <td className="p-3 text-gray-600">{product.stock}</td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchProducts}
        product={editingProduct}
      />
    </div>
  );
};

export default AdminProducts;
