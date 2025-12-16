import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, pageTitle = "Dashboard" }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">{pageTitle}</h2>
        </header>

        {/* Content */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
