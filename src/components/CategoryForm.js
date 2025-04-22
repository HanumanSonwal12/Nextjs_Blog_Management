'use client';

import { useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import { createData, updateData } from "@/utils/api";
import CategorySelect from "./CategorySelect";

const CategoryForm = ({ visible, onCancel, category, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  }, [category, form]);

  const handleSubmit = async (values) => {
    setLoading(true); 
    const slug = values.slug || values.name.toLowerCase().replace(/\s+/g, '-');

    try {
      const url = category ? `/categories/${category._id}` : "/categories/create";

      const data = category
        ? await updateData(url, { ...values, slug })
        : await createData(url, { ...values, slug });

      if (data.success) {
        onSuccess();
        form.resetFields();
      } else {
        console.error("API error:", data.message);
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Modal
      title={category ? "Edit Category" : "Add New Category"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      okText={category ? "Update" : "Create"}
      okButtonProps={{
        loading, 
        style: {
          backgroundColor: '#242a64',
          color: 'white',
          fontWeight: '600',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          transition: 'background-color 0.3s ease',
        },
        onMouseOver: (e) => {
          if (!loading) e.target.style.backgroundColor = '#1e2053';
        },
        onMouseOut: (e) => {
          if (!loading) e.target.style.backgroundColor = '#242a64';
        },
      }}
      cancelButtonProps={{
        style: {
          backgroundColor: '#f04d23',
          color: 'white',
          fontWeight: '600',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          transition: 'background-color 0.3s ease',
        },
        onMouseOver: (e) => e.target.style.backgroundColor = '#d03f1a',
        onMouseOut: (e) => e.target.style.backgroundColor = '#f04d23',
      }}
      centered
      className="max-w-2xl"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter category name" }]}
          className="text-[#242a64]"
        >
          <Input
            className="border border-gray-300 rounded-md py-3 px-4 text-base focus:ring-[#f04d23] focus:border-[#f04d23]"
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          className="text-[#242a64]"
        >
          <Input
            placeholder="Leave blank to auto-generate"
            className="border border-gray-300 rounded-md py-3 px-4 text-base focus:ring-[#f04d23] focus:border-[#f04d23]"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          className="text-[#242a64]"
        >
          <Input.TextArea
            rows={4}
            className="border border-gray-300 rounded-md py-3 px-4 text-base focus:ring-[#f04d23] focus:border-[#f04d23]"
          />
        </Form.Item>

        <Form.Item
          name="parent"
          label="Parent Category"
          className="text-[#242a64]"
        >
          <CategorySelect
            value={form.getFieldValue('parent')}
            onChange={(val) => form.setFieldsValue({ parent: val })}
            multiple={false}
            className="border border-gray-300 rounded-md py-3 px-4"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
