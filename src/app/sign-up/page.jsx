'use client';

import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import Image from 'next/image';
// import loginImg from '/public/login-image.png'; // <-- Add your image in public folder

const onFinish = (values) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Page = () => (
  <div style={{ minHeight: '100vh', backgroundColor: '#fff6e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', maxWidth: '900px', width: '100%', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      
      {/* Left Side - Image */}
      <div style={{ flex: 1, backgroundColor: '#ffe8cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image src="/images/login-image.png" alt="Login visual" width={300} height={300} />
      </div>

      {/* Right Side - Form */}
      <div style={{ flex: 1.2, padding: '40px' }} className='bg-[#ffe8cc]'>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>sign-up</h2>
        
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  </div>
);

export default Page;
