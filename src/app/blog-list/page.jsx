"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Tooltip } from "antd";
import { EditOutlined, CommentOutlined } from "@ant-design/icons";
import { fetchData } from "@/utils/api"; 

export default function WPStyleBlogTable() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchData("/blog");
        setBlogs(
          data.blogs.map((blog, index) => ({
            key: blog._id || index,
            title: blog.title,
            author: blog.author?.name || "Unknown",
            categories: blog.categories || [],
            tags: blog.tags || [],
            comments: blog.comments?.length || 0,
            date: new Date(blog.createdAt).toISOString().split("T")[0],
            seoTitle: blog.seoTitle,
            metaDescription: blog.metaDescription,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    };

    getBlogs();
  }, []);

  const columns = [
    {
      title: <input type="checkbox" className="cursor-pointer" />,
      dataIndex: "checkbox",
      key: "checkbox",
      width: 40,
      render: () => <input type="checkbox" className="cursor-pointer" />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => (
        <span className="text-blue-600 cursor-pointer hover:underline font-medium">
          {text}
        </span>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) =>
        categories.map((cat) => (
          <Tag color="blue" key={cat}>
            {cat}
          </Tag>
        )),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) =>
        tags.map((tag) => (
          <Tag color="purple" key={tag}>
            {tag}
          </Tag>
        )),
    },
    {
      title: <CommentOutlined />,
      dataIndex: "comments",
      key: "comments",
      align: "center",
      sorter: (a, b) => a.comments - b.comments,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <span className="text-blue-600">SEO Details</span>
          <EditOutlined className="text-blue-600 cursor-pointer" />
        </div>
      ),
      key: "seo",
      render: (_, record) => (
        <Tooltip title={record.metaDescription}>
          <span className="text-sm text-gray-700">{record.seoTitle}</span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded shadow">
      <Table
        columns={columns}
        dataSource={blogs}
        pagination={false}
        rowClassName="hover:bg-gray-50"
      />
    </div>
  );
}
