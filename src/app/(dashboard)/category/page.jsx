'use client';

import { useState, useEffect, useMemo } from "react";
import { Button, Table, Popconfirm, Tag, Space, Input, Tooltip } from "antd";
import CategoryForm from "@/components/CategoryForm";
import debounce from "lodash.debounce";
import { deleteData } from "@/utils/api";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; 

const themeColors = {
  primary: "#242a64",
  danger: "#f04d23",
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCategories = async (params = {}) => {
    setLoading(true);
    const { current, pageSize } = params.pagination || pagination;
    const searchTerm = params.search ?? search;

    const response = await fetch(`/api/categories?search=${searchTerm}&page=${current}&limit=${pageSize}`);
    const data = await response.json();

    if (data.status === 200) {
      const normalizedData = data.data.map(cat => ({
        ...cat,
        parent: cat.parent ? (typeof cat.parent === "object" ? cat.parent._id : cat.parent) : null,
        parentName: cat.parent && typeof cat.parent === "object" ? cat.parent.name : null,
      }));
      setCategories(normalizedData);
      setPagination({
        ...pagination,
        current,
        total: data.pagination.total || 0, 
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setPagination({ ...pagination, current: 1 });
        setSearch(value);
        fetchCategories({ search: value, pagination: { ...pagination, current: 1 } });
      }, 500),
    [pagination]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const getCategoryById = (id) => categories.find((cat) => cat._id === id);
  const getParentName = (parentId) => {
    if (!parentId) return null;
    const parent = getCategoryById(parentId);
    return parent ? parent.name : null;
  };
  const getChildCategories = (parentId) => categories.filter((cat) => cat.parent === parentId);

  const handleAddCategory = (values) => {
    const slug = values.slug || values.name.toLowerCase().replace(/\s+/g, '-');

    if (currentCategory) {
      const updated = categories.map((category) =>
        category._id === currentCategory._id
          ? { ...category, ...values, slug }
          : category
      );
      setCategories(updated);
    } else {
      setCategories([
        ...categories,
        {
          ...values,
          _id: Date.now().toString(),
          slug,
          count: 0,
          parent: values.parent || null,
        },
      ]);
    }

    setVisible(false);
    setCurrentCategory(null);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setVisible(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const subcategories = getChildCategories(categoryId);
    const idsToDelete = subcategories.length > 0
      ? [categoryId, ...subcategories.map((cat) => cat._id)]
      : [categoryId];
  
    try {
      await Promise.all(
        idsToDelete.map((id) => deleteData(`/categories/${id}`))
      );
      setCategories(categories.filter((cat) => !idsToDelete.includes(cat._id)));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const getPotentialParents = (categoryId) => {
    if (!categoryId) return categories;

    const isDescendant = (cat, ancestorId) => {
      if (!cat.parent) return false;
      if (cat.parent === ancestorId) return true;
      const parent = getCategoryById(cat.parent);
      return parent ? isDescendant(parent, ancestorId) : false;
    };

    return categories.filter(
      (cat) => cat._id !== categoryId && !isDescendant(cat, categoryId)
    );
  };

  const columns = [
    {
      title: <span className="font-semibold text-base">Name</span>,
      dataIndex: "name",
      render: (text, record) => (
        <a
          className="text-[16px] font-medium text-[#242a64] hover:underline"
          onClick={() => handleEditCategory(record)}
        >
          {text}
        </a>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: <span className="font-semibold text-base">Slug</span>,
      dataIndex: "slug",
    },
    {
      title: <span className="font-semibold text-base">Description</span>,
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: <span className="font-semibold text-base">Parent</span>,
      dataIndex: "parent",
      render: (parentId) => {
        const parentName = getParentName(parentId);
        return parentName ? (
          <Tag color={themeColors.primary}>{parentName}</Tag>
        ) : (
          <span className="text-gray-400">None</span>
        );
      },
    },
    {
      title: <span className="font-semibold text-base">Actions</span>,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Category">
            <Button
             size="medium"
              style={{ backgroundColor: themeColors.primary, color: "#fff" }}
              onClick={() => handleEditCategory(record)}
              icon={<EditOutlined  style={{fontSize:"15px"}} />} 
              shape="circle"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            description={
              getChildCategories(record._id).length > 0
                ? "This will also delete all subcategories. This action cannot be undone."
                : "This action cannot be undone."
            }
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Category">
              <Button
                size="medium"
                style={{ backgroundColor: themeColors.danger, color: "#fff" }}
                icon={<DeleteOutlined   style={{fontSize:"15px"}}/>} 
                shape="circle" 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    fetchCategories({ pagination });
  };

  return (
    <div className="container mx-auto px-2 sm:px-3 py-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242a64]">Categories</h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage your post categories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <Input.Search
            placeholder="Search categories"
            allowClear
            onChange={handleSearchChange}
            style={{ width: 250 }}
            size="middle"
          />
          <Button
            type="primary"
            style={{ backgroundColor: "#f04d23" }}
            onClick={() => {
              setCurrentCategory(null);
              setVisible(true);
            }}
          >
            Add New Category
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
        />
      </div>

      <CategoryForm
        visible={visible}
        onCancel={() => setVisible(false)}
        category={currentCategory}
        categories={categories}
        getPotentialParents={getPotentialParents}
        onSuccess={() => {
          fetchCategories(); 
          setVisible(false);
          setCurrentCategory(null);
        }}
      />
    </div>
  );
};

export default CategoriesPage;
