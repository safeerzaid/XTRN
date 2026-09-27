import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">XTRN Admin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md transition-colors ${
              isActive
                ? 'bg-gray-100 text-black font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md transition-colors ${
              isActive
                ? 'bg-gray-100 text-black font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          Orders
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
