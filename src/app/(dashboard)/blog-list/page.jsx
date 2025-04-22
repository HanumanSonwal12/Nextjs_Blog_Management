
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Button,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Badge,
  Space,
  Dropdown,
  Menu,
} from "antd";
import dayjs from "dayjs";
import {

  CommentOutlined,
  PlusOutlined,
  FilterOutlined,
  ReloadOutlined,
  EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import { deleteData, fetchData } from "@/utils/api";
import CreateBlog from "@/components/CreateBlog";

export default function WPStyleBlogTable() {
  const [blogs, setBlogs] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    author: null,
    tag: null,
    category: null,
    status: null,
    startDate: null,
    endDate: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  const router = useRouter();

  const themeColors = {
    primary: "#242a64",
    danger: "#f04d23",
  };

  const fetchBlogs = useCallback(async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: pageSize,
        search: searchText || "",
        author: filters.author || "",
        tag: filters.tag || "",
        category: filters.category || "",
        status: filters.status || "",
        startDate: filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : "",
        endDate: filters.endDate ? dayjs(filters.endDate).format('YYYY-MM-DD') : "",
      }).toString();

      const data = await fetchData(`/blog?${query}`);
      

      if (!data || !data.blogs) {
        throw new Error("Invalid response format");
      }

      const formattedBlogs = data.blogs.map((blog, index) => ({
        key: blog._id || index,
        id: blog._id,
        slug: blog.slug,
        title: blog.title,
        author: blog.author?.name || "Unknown",
        authorId: blog.author?._id || null,
        categories: blog.categories || [],
        tags: blog.tags || [],
        // comments: blog.comments?.length || 0,
        featuredImage: blog.image || null,
        image: blog.image || null,
        excerpt: blog.excerpt,
        seoTitle: blog.seoTitle,
        content: blog.content,
        metaKeywords: blog.metaKeywords || "",
        date: blog.createdAt ? new Date(blog.createdAt).toISOString().split("T")[0] : "Unknown date",
        status: blog.status || "published",
      }));

      setBlogs(formattedBlogs);
      setPagination((prev) => ({
        ...prev,
        total: data.total || formattedBlogs.length,
      }));

      const uniqueCategories = [...new Set(
        formattedBlogs.flatMap(blog => blog.categories.map(cat => ({ id: cat._id, name: cat.name })))
      )];
      const uniqueTags = [...new Set(formattedBlogs.flatMap(blog => blog.tags))];
      const uniqueAuthors = [...new Map(
        formattedBlogs.map(blog => [blog.authorId, { id: blog.authorId, name: blog.author }])
      ).values()];

      setCategories(uniqueCategories);
      setTags(uniqueTags);
      setAuthors(uniqueAuthors);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      message.error("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchText, filters, pagination.current, pagination.pageSize]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBlogs();
    }, 500);

    return () => clearTimeout(handler);
  }, [fetchBlogs]);

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsCreateModalVisible(true);
  };

  const handleView = (slug) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(`/blog/delete/${id}`);
      message.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete blog: " + (error.message || "Unknown error"));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      await Promise.all(selectedRowKeys.map(id => deleteData(`/blog/delete/${id}`)));
      message.success(`Successfully deleted ${selectedRowKeys.length} blogs`);
      setSelectedRowKeys([]);
      fetchBlogs();
    } catch (error) {
      message.error("Failed to delete selected blogs");
    }
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setIsCreateModalVisible(true);
  };

  const handleModalClose = () => {
    setIsCreateModalVisible(false);
    setEditingBlog(null);
  };

  const handleBlogSaved = () => {
    setIsCreateModalVisible(false);
    setEditingBlog(null);
    fetchBlogs();
  };

  const resetFilters = () => {
    setFilters({
      author: null,
      tag: null,
      category: null,
      status: null,
      startDate: null,
      endDate: null,
    });
    setSearchText("");
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (_, record) => (
        <div>
          <a
            className="text-blue-600 hover:underline font-medium"
            onClick={() => handleView(record.slug)}
          >
            {record.title}
          </a>

        </div>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => (
        <div className="flex flex-wrap gap-1">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Tag color="blue" key={cat._id || cat.name}>
                {cat.name}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">None</span>
          )}
          {categories.length > 2 && (
            <Tooltip title={categories.slice(2).map(cat => cat.name).join(", ")}>
              <Tag color="blue">+{categories.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags.length > 0 ? (
            tags.slice(0, 2).map((tag) => (
              <Tag color="purple" key={tag}>
                {tag}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">None</span>
          )}
          {tags.length > 2 && (
            <Tooltip title={tags.slice(2).join(", ")}>
              <Tag color="purple">+{tags.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    // {
    //   title: <CommentOutlined />,
    //   dataIndex: "comments",
    //   key: "comments",
    //   align: "center",
    //   sorter: (a, b) => a.comments - b.comments,
    //   render: (count) => (
    //     <Badge
    //       count={count}
    //       showZero
    //       style={{
    //         backgroundColor: count > 0 ? '#1890ff' : '#d9d9d9',
    //         fontSize: '12px'
    //       }}
    //     />
    //   ),
    // },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (
        <span>{dayjs(date).format('MMM D, YYYY')}</span>
      )
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
        <Space>
          <Tooltip title="Edit Blog">
            <Button
              type="text"
              onClick={() => handleEdit(record)}
              icon={<EditOutlined style={{ fontSize: "15px" }} />}
              size="medium"
              style={{ backgroundColor: themeColors.primary, color: "#fff" }}
              shape="circle"
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>

          <Popconfirm
            title="Are you sure you want to delete this blog?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="medium"
              style={{ backgroundColor: themeColors.danger, color: "#fff" }}
              icon={<DeleteOutlined style={{ fontSize: "15px" }} />}
              shape="circle"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold">Blog Posts</div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateBlog}
          style={{ backgroundColor: "#f04d23" }}
        >
          Create New Blog
        </Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={8}>
          <Input
            placeholder="Search by title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<FilterOutlined className="text-gray-400" />}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: "100%" }}
            value={filters.status}
            onChange={(val) => setFilters((f) => ({ ...f, status: val }))}
          >
            <Select.Option value="published">Published</Select.Option>
            <Select.Option value="draft">Draft</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Select
            placeholder="Author"
            allowClear
            style={{ width: "100%" }}
            value={filters.author}
            onChange={(val) => setFilters((f) => ({ ...f, author: val }))}
          >
            {authors.map((author) => (
              <Select.Option key={author.id} value={author.id}>
                {author.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            value={[
              filters.startDate ? dayjs(filters.startDate) : null,
              filters.endDate ? dayjs(filters.endDate) : null
            ]}
            onChange={(dates) => {
              setFilters((f) => ({
                ...f,
                startDate: dates?.[0]?.valueOf() || null,
                endDate: dates?.[1]?.valueOf() || null,
              }));
            }}
          />
        </Col>
      </Row>

      <div className="mb-4 flex justify-between items-center">
        <div>
          {selectedRowKeys.length > 0 && (
            <Space>
              <span className="text-sm text-gray-600">
                Selected {selectedRowKeys.length} blog
                {selectedRowKeys.length > 1 ? "s" : ""}
              </span>
              <Popconfirm
                title="Delete selected blogs?"
                description={`Are you sure you want to delete ${selectedRowKeys.length} selected blogs?`}
                onConfirm={handleBulkDelete}
                okText="Delete"
                cancelText="Cancel"
              >
                <Button danger size="small">
                  Delete Selected
                </Button>
              </Popconfirm>
            </Space>
          )}
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={resetFilters}
          size="small"
        >
          Reset Filters
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={blogs}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} blogs`,
          onChange: (page, pageSize) =>
            setPagination((prev) => ({ ...prev, current: page, pageSize })),
        }}
        rowClassName="hover:bg-gray-50"
        locale={{ emptyText: "No blogs found" }}
      />

      {isCreateModalVisible && (
        <CreateBlog
          initialData={editingBlog}
          isModalVisible={isCreateModalVisible}
          onSuccess={handleBlogSaved}
          onCancel={handleModalClose}
          isEditing={!!editingBlog}
        />
      )}
    </div>
  );
}