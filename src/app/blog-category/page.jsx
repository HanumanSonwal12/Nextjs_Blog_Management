'use client';

import { useState } from "react";
import { Button, Form, Input, Modal, Table, Popconfirm, Select } from "antd";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();  // Add this line to create the form instance

  const handleAddCategory = (values) => {
    if (currentCategory) {
      // Edit existing category
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id
          ? { ...category, ...values }
          : category
      );
      setCategories(updatedCategories);
    } else {
      // Add new category
      setCategories([
        ...categories,
        { ...values, id: categories.length + 1, subcategories: [] },
      ]);
    }
    setVisible(false);
    setCurrentCategory(null); // Reset edit state

    // Reset form after submission
    form.resetFields();
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setVisible(true);
    form.setFieldsValue(category);  // Pre-fill form for editing
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleAssignPosts = (categoryId, postIds) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? { ...category, posts: postIds }
          : category
      )
    );
  };

  const columns = [
    { title: "Category Name", dataIndex: "name" },
    {
      title: "Subcategories",
      dataIndex: "subcategories",
      render: (subcategories) => (
        <div>
          {subcategories.length > 0
            ? subcategories.join(", ")
            : "No Subcategories"}
        </div>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditCategory(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDeleteCategory(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl">Manage Categories</h1>
        <Button type="primary" onClick={() => setVisible(true)}>
          Create New Category
        </Button>
      </div>

      <Table dataSource={categories} columns={columns} rowKey="id" />

      {/* Modal for Adding/Editing Category */}
      <Modal
        visible={visible}
        title={currentCategory ? "Edit Category" : "Create Category"}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          initialValues={currentCategory}
          onFinish={handleAddCategory}
          layout="vertical"
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter the category name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Subcategories" name="subcategories">
            <Select mode="tags" placeholder="Add subcategories">
              {/* Optionally, you can add options dynamically here */}
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {currentCategory ? "Save Changes" : "Create Category"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
