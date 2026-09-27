import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-900">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8" data-lenis-prevent>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
