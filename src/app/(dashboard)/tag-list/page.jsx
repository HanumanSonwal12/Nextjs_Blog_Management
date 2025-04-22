"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; 
const TagListView = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingTag, setEditingTag] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const themeColors = {
    primary: "#242a64",
    danger: "#f04d23",
  };
  // Fetch Tags
  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tag");
      const data = await res.json();
      if (data.success) setTags(data.tags || []);
    } catch (error) {
      message.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Add or Edit Tag
  const handleFinish = async (values) => {
    const isEdit = !!editingTag;
    const url = isEdit ? `/api/tag/${editingTag._id}` : `/api/tag/create`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        message.success(data.message || (isEdit ? "Tag updated" : "Tag created"));
        fetchTags();
        form.resetFields();
        setModalVisible(false);
        setEditingTag(null);
      } else {
        message.error(data.message || "Failed to save tag");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  // Delete Tag
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/tag/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        message.success("Tag deleted");
        fetchTags();
      } else {
        message.error(data.message || "Delete failed");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  // Columns
  const columns = [
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
           size="medium"
           style={{ backgroundColor: themeColors.primary, color: "#fff" }}
           
           icon={<EditOutlined  style={{fontSize:"15px"}} />} 
           shape="circle"
            onClick={() => {
              setEditingTag(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
            type="link"
          >
            
          </Button>
          <Button 
            size="medium"
            style={{ backgroundColor: themeColors.danger, color: "#fff" }}
            icon={<DeleteOutlined   style={{fontSize:"15px"}}/>} 
            shape="circle" 
          onClick={() => handleDelete(record._id)} danger type="link">
            
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tag Manager</h2>
        <Button
          type="primary"
          style={{ backgroundColor: "#f04d23" }}
          onClick={() => {
            setEditingTag(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add New Tag
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingTag ? "Edit Tag" : "Add Tag"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingTag(null);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="name"
            label="Tag Name"
            rules={[{ required: true, message: "Tag name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug (optional)">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagListView;
