"use client";
import React, { useState } from 'react';
import { Form, Button } from 'antd';
import CategorySelect from '@/components/CategorySelect';

const BlogForm = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleFinish = (values) => {
    console.log('Form values:', values);
    // values.category => category ID
  };

  return (
    <Form onFinish={handleFinish} layout="vertical">
      <Form.Item label="Category" name="category" rules={[{ required: true }]}>
        <CategorySelect
          value={selectedCategory}
          onChange={value => setSelectedCategory(value)}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">Submit</Button>
    </Form>
  );
};

export default BlogForm;
