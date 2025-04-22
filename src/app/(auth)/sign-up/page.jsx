'use client';

import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

const Page = () => {
  const router = useRouter(); 

  const onFinish = async (values) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Signup Success:', data);
        router.push('/login'); // ✅ Redirect on success
      } else {
        console.error('Signup Failed:', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff6e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', maxWidth: '900px', width: '100%', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        
        {/* Left Side - Image */}
        <div style={{ flex: 1, backgroundColor: '#ffe8cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/images/login-image.png" alt="Login visual" width={300} height={300} />
        </div>

        {/* Right Side - Form */}
        <div style={{ flex: 1.2, padding: '40px' }} className='bg-[#ffe8cc]'>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Sign Up</h2>
          
          <Form
            layout="vertical"
            name="register-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
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

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span>Already have an account? </span>
            <Link href="/login" style={{ color: '#f04d23', fontWeight: 'bold' }}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
