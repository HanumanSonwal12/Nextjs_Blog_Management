"use client";

import { Table, Tag, Tooltip } from "antd";
import { EditOutlined, CommentOutlined } from "@ant-design/icons";

const blogData = [
  {
    key: 1,
    title: "Understanding React Server Components",
    author: "Admin",
    categories: ["React", "Next.js"],
    tags: ["RSC", "SSR"],
    comments: 5,
    date: "2025-04-15",
    seoTitle: "React Server Components",
    metaDescription: "Learn the new React server rendering model.",
  },
  {
    key: 2,
    title: "A Guide to WordPress Headless CMS",
    author: "Jane Doe",
    categories: ["WordPress", "CMS"],
    tags: ["API", "Headless"],
    comments: 3,
    date: "2025-04-10",
    seoTitle: "WordPress Headless Setup",
    metaDescription: "Setup a headless WordPress frontend.",
  },
  {
    key: 3,
    title: "Optimizing Next.js Apps for SEO",
    author: "John Smith",
    categories: ["Next.js", "SEO"],
    tags: ["Meta", "Performance"],
    comments: 7,
    date: "2025-03-20",
    seoTitle: "Next.js SEO Tips",
    metaDescription: "How to improve SEO in Next.js apps.",
  },
];

export default function WPStyleBlogTable() {
  const columns = [
    {
      title: <input type="checkbox" className="cursor-pointer" />,
      dataIndex: "checkbox",
      key: "checkbox",
      width: 40,
      render: () => <input type="checkbox" className="cursor-pointer" />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => (
        <span className="text-blue-600 cursor-pointer hover:underline font-medium">
          {text}
        </span>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) =>
        categories.map((cat) => (
          <Tag color="blue" key={cat}>
            {cat}
          </Tag>
        )),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) =>
        tags.map((tag) => (
          <Tag color="purple" key={tag}>
            {tag}
          </Tag>
        )),
    },
    {
      title: <CommentOutlined />,
      dataIndex: "comments",
      key: "comments",
      align: "center",
      sorter: (a, b) => a.comments - b.comments,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <span className="text-blue-600">SEO Details</span>
          <EditOutlined className="text-blue-600 cursor-pointer" />
        </div>
      ),
      key: "seo",
      render: (_, record) => (
        <Tooltip title={record.metaDescription}>
          <span className="text-sm text-gray-700">{record.seoTitle}</span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded shadow">
      <Table
        columns={columns}
        dataSource={blogData}
        pagination={false}
        rowClassName="hover:bg-gray-50"
      />
    </div>
  );
}
