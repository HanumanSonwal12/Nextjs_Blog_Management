"use client";
import { Layout } from 'antd';
import Image from 'next/image';
import Menubar from './Menubar';

const { Sider } = Layout;

const Sidebar = ({ collapsed, width }) => (
  <Sider
    className="custom-sidebar transition-all"
    theme="light"
    trigger={null}
    collapsible
    collapsed={collapsed}
    width={width}
    breakpoint="md" 
    collapsedWidth="80" 
    
  >
    <div
      className="logo flex justify-center"
      style={{
        textAlign: "center",
        padding: collapsed ? "10px 5px" : "10px", 
      }}
    >
      <Image
        src="/images/svg-logo.svg"
        alt="Logo"
        width={collapsed ? 50 : 150} 
        height={collapsed ? 30 : 80}
      />
    </div>

    <Menubar />
  </Sider>
);

export default Sidebar;
