'use client';

import { Card, Col, Row, Table, Button, Statistic } from 'antd';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [blogStats, setBlogStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    blogsThisMonth: 0,
  });

  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    setBlogStats({
      totalBlogs: 100,
      publishedBlogs: 70,
      draftBlogs: 30, 
      blogsThisMonth: 10,
    });

    setRecentBlogs([
      { key: '1', title: 'Blog 1', status: 'Published', createdAt: '2025-04-20', author: 'John Doe', category: 'Tech' },
      { key: '2', title: 'Blog 2', status: 'Draft', createdAt: '2025-04-18', author: 'Jane Doe', category: 'Lifestyle' },
      { key: '3', title: 'Blog 3', status: 'Published', createdAt: '2025-04-15', author: 'John Doe', category: 'Health' },
    ]);
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Blogs Created',
        data: [5, 10, 15, 10, 5, 7],
        borderColor: '#242a64', 
        backgroundColor: '#f04d23',
        fill: false,
      },
    ],
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" href={`/blog/${record.key}`} style={{ color: '#242a64' }}>View</Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: '#f9f9f9' }}>
    
      <Row gutter={16} justify="space-between">
        <Col span={6}>
          <Card bordered={false} className="stat-card" style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', border: '2px solid #242a64' }}>
            <Statistic title="Total Blogs" value={blogStats.totalBlogs} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="stat-card" style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', border: '2px solid #242a64' }}>
            <Statistic title="Published Blogs" value={blogStats.publishedBlogs} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="stat-card" style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', border: '2px solid #242a64' }}>
            <Statistic title="Draft Blogs" value={blogStats.draftBlogs} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="stat-card" style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', border: '2px solid #242a64' }}>
            <Statistic title="Blogs This Month" value={blogStats.blogsThisMonth} />
          </Card>
        </Col>
      </Row>

      {/* Blog Charts and Recent Blogs Section */}
      <Row gutter={16} className="my-4">
        <Col span={16}>
          <Card title="Blog Creation Over Time" bordered={false} style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', border: '2px solid #242a64' }}>
            <Line data={chartData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Recent Blogs" bordered={false} style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', border: '2px solid #242a64' }}>
            <Table
              columns={columns}
              dataSource={recentBlogs}
              responsive
              pagination={false}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
