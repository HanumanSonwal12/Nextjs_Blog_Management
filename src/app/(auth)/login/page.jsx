'use client';

import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';  // Import the Link component from next/link

const Page = () => {
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('/api/auth/login', values);
      console.log("Response:", response);
      if (response.data.status === 200) {
        Cookies.set('token', response.data.token);
        Cookies.set('user', JSON.stringify(response.data.user));
      
        message.success('Login successful!');
        router.push('/');
      } else {
        message.error('Login failed');
      }
    } catch (error) {
      console.log("Login Error:", error);
      message.error(error?.response?.data?.message || 'Login failed');
    }
  };

  const onFinishFailed = (errorInfo) => {
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff6e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', maxWidth: '900px', width: '100%', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>

        <div style={{ flex: 1, backgroundColor: '#ffe8cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/images/login-image.png" alt="Login visual" width={300} height={300} />
        </div>

        <div style={{ flex: 1.2, padding: '40px' }} className='bg-[#ffe8cc]'>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Login</h2>

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
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ backgroundColor: '#f04d23', borderColor: '#f04d23' }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span>Do not have an account? </span>
            <Link href="/sign-up" style={{ color: '#f04d23', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
