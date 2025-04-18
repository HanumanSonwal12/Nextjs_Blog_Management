"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Tag, Tooltip, Popconfirm, message, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CommentOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { deleteData, fetchData } from "@/utils/api";
import CreateBlog from "@/components/CreateBlog";

export default function WPStyleBlogTable() {
  const [blogs, setBlogs] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null); // Track the blog being edited
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await fetchData("/blog");
      setBlogs(
        data.blogs.map((blog, index) => ({
          key: blog._id || index,
          id: blog._id,
          slug: blog.slug,
          title: blog.title,
          author: blog.author?.name || "Unknown",
          categories: blog.categories || [],
          tags: blog.tags || [],
          comments: blog.comments?.length || 0,
          date: new Date(blog.createdAt).toISOString().split("T")[0],
          seoTitle: blog.seoTitle,
          metaDescription: blog.metaDescription,
          content: blog.content,
          excerpt: blog.excerpt,
          featuredImage: blog.featuredImage,
          subcategories: blog.subcategories || [],
          status: blog.status || "published",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  const handleEdit = (blog) => {
    console.log(blog,'hhhh')
    setEditingBlog(blog);
    setIsCreateModalVisible(true);
  };
  

  const handleDelete = async (id) => {
    try {
      await deleteData(`/blog/delete/${id}`);
      message.success("Blog deleted successfully");
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } catch (error) {
      message.error("Failed to delete blog");
    }
  };

  const handleCreateBlog = () => {
    setEditingBlog(null); // Clear any editing blog data
    setIsCreateModalVisible(true);
  };

  const handleModalClose = () => {
    setIsCreateModalVisible(false);
    setEditingBlog(null);
  };

  const handleBlogSaved = (blogData, isNewBlog = true) => {
    if (isNewBlog) {
      // Add the new blog to the table
      setBlogs((prevBlogs) => [blogData, ...prevBlogs]);
    } else {
      // Update the existing blog in the table
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogData.id ? { ...blog, ...blogData } : blog
        )
      );
    }
    
    // Close the modal
    setIsCreateModalVisible(false);
    setEditingBlog(null);
    
    // Refresh the blogs list
    fetchBlogs();
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (_, record) => (
        <a
          href={`/blog/${record.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          {record.title}
        </a>
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "published" ? "green" : "orange"}>
          {status === "published" ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Tooltip title="Edit Blog">
            <EditOutlined
              onClick={() => handleEdit(record)}
              className="text-blue-600 cursor-pointer hover:text-blue-800"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Blog">
              <DeleteOutlined className="text-red-600 cursor-pointer hover:text-red-800" />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          {selectedRowKeys.length > 0 && (
            <span className="text-sm text-gray-600">
              Selected {selectedRowKeys.length} blog
              {selectedRowKeys.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreateBlog}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create New Blog
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={blogs}
        pagination={{ pageSize: 10 }}
        rowClassName="hover:bg-gray-50"
      />
      
      {isCreateModalVisible && (
        <CreateBlogWrapper 
          visible={isCreateModalVisible} 
          onCancel={handleModalClose}
          onSave={handleBlogSaved}
          blogData={editingBlog}
          isEditing={!!editingBlog}
        />
      )}
    </div>
  );
}

// Wrapper component to integrate CreateBlog
function CreateBlogWrapper({ visible, onCancel, onSave, blogData, isEditing }) {
  // This component helps integrate the CreateBlog component
  // It manages visibility and passes the blog data for editing
  
  const handleSuccess = (data) => {
    onSave(data, !isEditing);
  };
  
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <CreateBlog 
        initialData={blogData}
        isModalVisible={visible}
        onSuccess={handleSuccess}
        onCancel={onCancel}
        isEditing={isEditing}
      />
    </div>
  );
}