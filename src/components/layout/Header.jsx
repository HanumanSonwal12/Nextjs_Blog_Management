"use client";
import React from 'react';
import { Layout, Button, Dropdown, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Spin } from "antd";

const { Header } = Layout;

function DashbardHeader({ collapsed, toggleCollapsed }) {
  const router = useRouter();

  const menuItems = [
    {
      key: 'profile',
      label: 'Profile Settings',
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: () => handleLogout(),
    },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <Header
      className="!bg-[#242a64] border-b border-[#f1f1f1] flex items-center justify-between"
      style={{ position: 'sticky', top: 0, zIndex: 1, padding: 0 }}
    >
      <div className="flex items-center">
        <Button
          className="!bg-[#f04d23] border-2 border-[#f04d23]"
          onClick={toggleCollapsed}
          style={{ marginLeft: '16px' }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined style={{ color: "#fff" }} />
          ) : (
            <MenuFoldOutlined style={{ color: "#fff" }} />
          )}
        </Button>

        <span className="font-medium text-[#fff] ms-5 hidden sm:block">Welcome, Vineet</span>
      </div>

      <div className="flex items-center gap-6" style={{ marginRight: '16px' }}>
        <Dropdown
          menu={<Menu items={menuItems} />}
          placement="bottomRight"
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/images/avtar.svg" alt="Avatar" width={40} height={40} />

            {/* <div className="font-medium text-[#242a64]">
              <Spin className="ml-[10px]" />
            </div> */}          </div>
        </Dropdown>
      </div>
    </Header>
  );
}

export default DashbardHeader;
