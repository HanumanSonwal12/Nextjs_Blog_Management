"use client";
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashbardHeader from './Header';

const SidebarWrapper = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="container  flex h-screen">
      <Sidebar collapsed={collapsed} width={256} className="fixed top-0 left-0 h-full" />

      <div className="flex flex-col flex-1" style={{ width: '800px' }} >
        <DashbardHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} className="fixed top-0 left-0 right-0" />

        <main className="p-3 bg-gray-200 flex-1 overflow-y-auto h-auto">
          {children}
        </main>
      </div>
    </div>

  );
};

export default SidebarWrapper;


