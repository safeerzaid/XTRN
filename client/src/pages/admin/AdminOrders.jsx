import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/admin/all');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/admin/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Failed to update order status', error);
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-3 text-sm font-semibold text-gray-600 rounded-tl-md">Order ID</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Customer</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Total</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Items</th>
                <th className="p-3 text-sm font-semibold text-gray-600 rounded-tr-md">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm font-medium text-gray-800">{order._id.substring(order._id.length - 8)}</td>
                  <td className="p-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-sm text-gray-600">
                    <div className="font-medium text-gray-800">{order.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{order.user?.email || 'N/A'}</div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{formatPrice(order.totalAmount)}</td>
                  <td className="p-3 text-sm text-gray-600">{order.items?.length || 0} items</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border border-gray-300 rounded p-1 text-sm bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
