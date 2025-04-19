'use client';

import { useState } from "react";
import { Button, Form, Input, Modal, Table, Popconfirm, Select, Tag, Space } from "antd";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Uncategorized", slug: "uncategorized", description: "Default category", count: 5, parent: null }
  ]);
  const [visible, setVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();

  // Helper function to get category by ID
  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  // Get parent category name
  const getParentName = (parentId) => {
    if (!parentId) return null;
    const parent = getCategoryById(parentId);
    return parent ? parent.name : null;
  };

  // Get children categories (subcategories)
  const getChildCategories = (parentId) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  const handleAddCategory = (values) => {
    // Generate slug from name if not provided
    const slug = values.slug || values.name.toLowerCase().replace(/\s+/g, '-');
    
    if (currentCategory) {
      // Edit existing category
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id
          ? { ...category, ...values, slug }
          : category
      );
      setCategories(updatedCategories);
    } else {
      // Add new category
      setCategories([
        ...categories,
        { 
          ...values, 
          id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
          slug,
          count: 0
        },
      ]);
    }
    setVisible(false);
    setCurrentCategory(null);
    form.resetFields();
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setVisible(true);
    form.setFieldsValue(category);
  };

  const handleDeleteCategory = (categoryId) => {
    // Find all subcategories
    const subcategories = categories.filter(cat => cat.parent === categoryId);
    
    if (subcategories.length > 0) {
      // Delete the category and all its subcategories
      const idsToDelete = [categoryId, ...subcategories.map(cat => cat.id)];
      setCategories(categories.filter(cat => !idsToDelete.includes(cat.id)));
    } else {
      // Simple delete if no subcategories
      setCategories(categories.filter((category) => category.id !== categoryId));
    }
  };

  // Function to get all potential parent categories (excluding itself and its children)
  const getPotentialParents = (categoryId) => {
    // If it's a new category, all categories are potential parents
    if (!categoryId) return categories;
    
    // Function to check if a category is a descendant of the current category
    const isDescendant = (cat, ancestorId) => {
      if (!cat.parent) return false;
      if (cat.parent === ancestorId) return true;
      const parentCat = getCategoryById(cat.parent);
      return parentCat ? isDescendant(parentCat, ancestorId) : false;
    };
    
    // Filter out the category itself and all its descendants
    return categories.filter(cat => 
      cat.id !== categoryId && !isDescendant(cat, categoryId)
    );
  };

  // Render subcategories as tags
  const renderSubcategories = (categoryId) => {
    const subcats = getChildCategories(categoryId);
    
    if (subcats.length === 0) {
      return <span className="text-gray-400">None</span>;
    }
    
    return (
      <Space size="small" wrap>
        {subcats.map(subcat => (
          <Tag key={subcat.id} color="green">{subcat.name}</Tag>
        ))}
      </Space>
    );
  };

  const columns = [
    { 
      title: "Name", 
      dataIndex: "name",
      render: (text, record) => (
        <a className="font-medium text-blue-600 hover:underline" onClick={() => handleEditCategory(record)}>
          {text}
        </a>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    { 
      title: "Description", 
      dataIndex: "description",
      ellipsis: true,
    },
    { 
      title: "Slug", 
      dataIndex: "slug" 
    },
    {
      title: "Parent",
      dataIndex: "parent",
      render: (parentId) => {
        const parentName = getParentName(parentId);
        return parentName ? <Tag color="blue">{parentName}</Tag> : <span className="text-gray-400">None</span>;
      }
    },
    {
      title: "Subcategories",
      render: (_, record) => renderSubcategories(record.id)
    },
    {
      title: "Count",
      dataIndex: "count",
      render: (count) => (
        <Tag color={count > 0 ? "blue" : "default"}>{count}</Tag>
      ),
      sorter: (a, b) => a.count - b.count
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEditCategory(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            description={getChildCategories(record.id).length > 0 ? 
              "This will also delete all subcategories. This action cannot be undone." : 
              "This action cannot be undone."}
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Add a new subcategory when button is clicked
  const handleAddSubcategory = (parentId) => {
    setCurrentCategory(null);
    form.resetFields();
    form.setFieldsValue({ parent: parentId });
    setVisible(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-gray-500">Manage your post categories</p>
        </div>
        <Button type="primary" onClick={() => {
          setCurrentCategory(null);
          form.resetFields();
          setVisible(true);
        }}>
          Add New Category
        </Button>
      </div>

      <div className="bg-white rounded-md shadow">
        <Table 
          dataSource={categories} 
          columns={columns} 
          rowKey="id" 
          pagination={{ 
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          expandable={{
            expandedRowRender: (record) => {
              const subcategories = getChildCategories(record.id);
              if (subcategories.length === 0) {
                return (
                  <div className="px-4 py-2">
                    <p className="text-gray-500">No subcategories found.</p>
                    <Button 
                      type="link" 
                      onClick={() => handleAddSubcategory(record.id)}
                      className="p-0"
                    >
                      + Add subcategory
                    </Button>
                  </div>
                );
              }
              
              return (
                <div className="px-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium">Subcategories of "{record.name}"</h3>
                    <Button 
                      type="link" 
                      onClick={() => handleAddSubcategory(record.id)}
                    >
                      + Add subcategory
                    </Button>
                  </div>
                  <Table 
                    dataSource={subcategories}
                    columns={columns.filter(col => col.title !== "Subcategories" && col.title !== "Parent")}
                    rowKey="id"
                    size="small"
                    pagination={false}
                  />
                </div>
              );
            }
          }}
        />
      </div>

      {/* Modal for Adding/Editing Category */}
      <Modal
        open={visible}
        title={currentCategory ? "Edit Category" : "Add New Category"}
        onCancel={() => setVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          initialValues={currentCategory || { parent: null }}
          onFinish={handleAddCategory}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the category name!" }]}
          >
            <Input placeholder="Category name" />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            help="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
          >
            <Input placeholder="category-slug" />
          </Form.Item>

          <Form.Item
            label="Parent Category"
            name="parent"
          >
            <Select 
              placeholder="None" 
              allowClear
              options={getPotentialParents(currentCategory?.id).map(cat => ({ 
                value: cat.id, 
                label: cat.name
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Description of the category (optional)" 
            />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {currentCategory ? "Update Category" : "Add Category"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;