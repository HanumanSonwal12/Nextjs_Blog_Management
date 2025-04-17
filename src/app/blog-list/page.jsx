"use client";

import { useState, useEffect } from "react";
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
  Spin,
} from "antd";
import { apiGet, apiPut, apiDelete, fetchData } from "@/utils/api";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetchData("/blog");
      setBlogs(res.blogs);
    } catch (err) {
      message.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (record) => {
    setEditingBlog(record);
    form.setFieldsValue({
      ...record,
      tags: record.tags?.join(", "),
      categories: record.categories?.join(", "),
      subcategories: record.subcategories?.join(", "),
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      const updatedBlog = {
        ...editingBlog,
        ...values,
        tags: values.tags?.split(",").map((t) => t.trim()),
        categories: values.categories?.split(",").map((c) => c.trim()),
        subcategories: values.subcategories?.split(",").map((s) => s.trim()),
      };

      await apiPut(`/blogs/${editingBlog._id}`, updatedBlog);
      message.success("Blog updated!");
      setIsEditModalOpen(false);
      setEditingBlog(null);
      form.resetFields();
      fetchBlogs(); 
    } catch (error) {
      message.error("Failed to update blog");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDelete(`/blogs/${id}`);
      message.success("Blog deleted");
      fetchBlogs();
    } catch {
      message.error("Delete failed");
    }
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
      render: (subcategories) => subcategories?.join(", "),
    },
    {
      title: "Image",
      key: "coverImage",
      render: (_, record) => (
        <img
          src={record.coverImage}
          alt={record.title}
          width={100}
          height={60}
        />
      ),
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
            onConfirm={() => handleDelete(record._id)}
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

      {loading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={blogs} columns={columns} rowKey="_id" bordered />
      )}

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
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Content is required" }]}
          >
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

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true }]}
          >
            <Select options={[{ value: "published" }, { value: "draft" }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
