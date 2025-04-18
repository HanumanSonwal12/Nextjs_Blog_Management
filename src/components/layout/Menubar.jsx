"use client";
import React, { useState, useEffect } from "react";
import {
  DashboardOutlined,
  ShopOutlined,
  TagOutlined,
  SettingOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Menubar = () => {
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState("");

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link href="/">Dashboard</Link>,
      path: "/",
      id: 45,
    },
    {
      key: "2",
      icon: <ShopOutlined />,
      label: <Link href="/blog-list">Blog List</Link>,
      path: "/blog-list",
      id: 154,
    },
    // {
    //   key: "3",
    //   icon: <DatabaseOutlined />,
    //   label: <Link href="/blog-create">Create Blog</Link>,
    //   path: "/blog-create",
    // },
    {
      key: "4",
      icon: <TagOutlined />,
      label: <Link href="/blog-category">Categories</Link>,
      path: "/blog-category",
    },
    {
      key: "sub2",
      icon: <SettingOutlined />,
      label: "Settings",
      items: [
        {
          key: "18",
          label: <Link href="/admin/settings/profile">Profile</Link>,
          path: "/admin/settings/profile",
        },
        {
          key: "19",
          label: <Link href="/admin/settings/account">Account</Link>,
          path: "/admin/settings/account",
        },
      ],
    },
  ];

  useEffect(() => {
    const matchedItem = menuItems
      .flatMap((item) => (item.items ? [item, ...item.items] : item))
      .find((item) => pathname === item.path);

    if (matchedItem) {
      setSelectedKey(matchedItem.key);
    }
  }, [pathname]);

  const menuStyles = {
    default: { backgroundColor: "transparent", color: "#242a64" },
    active: {
      backgroundColor: "#f04d23", 
      color: "#fff", 
      borderRadius: "8px", 
    },
  };

  return (
    <Menu
      style={{ padding: "10px", width: "100%" }}
      theme="light"
      mode="inline"
      selectedKeys={[selectedKey]} 
      onClick={(e) => setSelectedKey(e.key)} 
      items={menuItems.map((item) => ({
        ...item,
        style: selectedKey === item.key ? menuStyles.active : menuStyles.default,
        items: item.items
          ? item.items.map((child) => ({
              ...child,
              label: (
                <Link href={child.path} passHref>
                  {child.label}
                </Link>
              ),
              style: selectedKey === child.key ? menuStyles.active : menuStyles.default,
            }))
          : undefined,
      }))}
    />
  );
};

export default Menubar;
