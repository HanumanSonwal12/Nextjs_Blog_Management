"use client";

import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";

const TagModal = ({ visible, onClose, fetchTags, editingTag }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingTag) {
      form.setFieldsValue(editingTag);
    } else {
      form.resetFields();
    }
  }, [editingTag, form]);

  // ✅ Handle Add or Edit
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
        onClose();
      } else {
        message.error(data.message || "Failed to save tag");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      title={editingTag ? "Edit Tag" : "Add Tag"}
      open={visible}
      onCancel={onClose}
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
  );
};

export default TagModal;
