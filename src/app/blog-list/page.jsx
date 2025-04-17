"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tag,
  Select,
} from "antd";

const initialBlogs = [
  {
    id: 1,
    title: "First Draft Post",
    content: "Some draft content...",
    tags: ["draft", "blog"],
    categories: ["Dev"],
    subcategories: ["JavaScript", "Frontend"], // Subcategories added
    excerpt: "Short summary of draft",
    seoTitle: "SEO Draft",
    metaDescription: "SEO Description for draft",
    author: "Jane Doe",
    readingTime: 5,
    coverImage: "https://via.placeholder.com/400x200", // Featured image added
    status: "draft",
  },
  {
    id: 2,
    title: "Published React Tips",
    content: "Some content about React...",
    tags: ["react", "tips"],
    categories: ["Tech"],
    subcategories: ["React", "Frontend"], // Subcategories added
    excerpt: "Quick React Tips",
    seoTitle: "React SEO Title",
    metaDescription: "Meta description",
    author: "John Smith",
    readingTime: 3,
    coverImage: "https://via.placeholder.com/400x200", // Featured image added
    status: "published",
  },
];

export default function BlogList() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = (record) => {
    setEditingBlog(record);
    form.setFieldsValue({
      ...record,
      tags: record.tags?.join(", "),
      categories: record.categories?.join(", "),
      subcategories: record.subcategories?.join(", "), // Handle subcategories
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedBlog = {
          ...editingBlog,
          ...values,
          tags: values.tags?.split(",").map((t) => t.trim()),
          categories: values.categories?.split(",").map((c) => c.trim()),
          subcategories: values.subcategories?.split(",").map((s) => s.trim()), // Handle subcategories
        };

        setBlogs((prev) =>
          prev.map((blog) =>
            blog.id === editingBlog.id ? updatedBlog : blog
          )
        );
        message.success("Blog updated successfully!");
        setIsEditModalOpen(false);
        setEditingBlog(null);
        form.resetFields();
      })
      .catch(() => {
        message.error("Please fill all required fields.");
      });
  };

  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    message.success("Blog deleted.");
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Subcategories",
      dataIndex: "subcategories",
      key: "subcategories",
      render: (subcategories) => subcategories?.join(", "), // Display subcategories
    },
    {
      title: "Image",
      key: "coverImage",
      render: (_, record) => (
        <img src={record.coverImage} alt={record.title} width={100} height={60} />
      ), // Display image
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "published" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Blog List</h2>
      <Table dataSource={blogs} columns={columns} rowKey="id" bordered />

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        title="Edit Blog"
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Content is required" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Tags" name="tags">
            <Input placeholder="e.g. react, blog, js" />
          </Form.Item>

          <Form.Item label="Categories" name="categories">
            <Input placeholder="e.g. frontend, tech" />
          </Form.Item>

          <Form.Item label="Subcategories" name="subcategories">
            <Input placeholder="e.g. javascript, nodejs" />
          </Form.Item>

          <Form.Item label="Excerpt" name="excerpt">
            <Input />
          </Form.Item>

          <Form.Item label="SEO Title" name="seoTitle">
            <Input />
          </Form.Item>

          <Form.Item label="Meta Description" name="metaDescription">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Author" name="author">
            <Input />
          </Form.Item>

          <Form.Item label="Reading Time (mins)" name="readingTime">
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item label="Cover Image URL" name="coverImage">
            <Input />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select options={[{ value: "published" }, { value: "draft" }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
