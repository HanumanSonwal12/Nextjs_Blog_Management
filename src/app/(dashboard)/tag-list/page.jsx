
"use client";

import { useEffect, useState } from "react";
import { Table, Button, message, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TagModal from "@/components/TagForm";


const TagListView = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const themeColors = {
    primary: "#242a64",
    danger: "#f04d23",
  };

  // ✅ Fetch All Tags
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

  // ✅ Delete Tag
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

  useEffect(() => {
    fetchTags();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            size="medium"
            style={{ backgroundColor: themeColors.primary, color: "#fff" }}
            icon={<EditOutlined style={{ fontSize: "15px" }} />}
            shape="circle"
            onClick={() => {
              setEditingTag(record);
              setModalVisible(true);
            }}
            type="link"
          />
          <Button
            size="medium"
            style={{ backgroundColor: themeColors.danger, color: "#fff" }}
            icon={<DeleteOutlined style={{ fontSize: "15px" }} />}
            shape="circle"
            onClick={() => handleDelete(record._id)}
            danger
            type="link"
          />
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

      <TagModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTag(null);
          form.resetFields();
        }}
        fetchTags={fetchTags}
        editingTag={editingTag}
      />
    </div>
  );
};

export default TagListView;
