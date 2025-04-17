"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  Checkbox,
  Card,
  message,
  Tooltip,
} from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";

export default function CreateBlog() {
  const [form] = Form.useForm();
  const [isDraft, setIsDraft] = useState(true);
  const [fileList, setFileList] = useState([]);

  const handleFinish = (values) => {
    const formattedData = {
      title: values.title,
      content: values.content,
      tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
      categories: values.categories
        ? values.categories.split(",").map((cat) => cat.trim())
        : [],
      subcategories: values.subcategories
        ? values.subcategories.split(",").map((sub) => sub.trim())
        : [],
      excerpt: values.excerpt,
      seoTitle: values.seoTitle,
      metaDescription: values.metaDescription,
      featuredImage:
        fileList.length > 0 ? fileList[0].name : null,
      status: isDraft ? "draft" : "published",
    };

    console.log("✅ Submitted Blog Data:", formattedData);
    message.success(isDraft ? "Draft saved!" : "Blog published!");
    form.resetFields();
    setFileList([]);
    setIsDraft(true);
  };

  const handleFinishFailed = (errorInfo) => {
    console.log("❌ Validation Failed:", errorInfo);
    message.error("Please fix the errors before submitting.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card title="Blog Details" className="shadow-md rounded-xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            className="space-y-6"
          >
            {/* Title */}
            <Form.Item
              label="Post Title"
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input size="large" placeholder="Enter blog title..." />
            </Form.Item>

            {/* Content */}
            <Form.Item
              label="Post Content"
              name="content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <Input.TextArea
                rows={10}
                placeholder="Write your content here..."
                className="resize-none"
              />
            </Form.Item>

            {/* Tags, Categories, Subcategories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Form.Item
                label="Tags"
                name="tags"
                rules={[
                  { required: true, message: "Enter at least one tag" },
                ]}
              >
                <Input placeholder="e.g., react, blog" />
              </Form.Item>

              <Form.Item
                label="Categories"
                name="categories"
                rules={[
                  { required: true, message: "Enter at least one category" },
                ]}
              >
                <Input placeholder="e.g., Tech, Dev" />
              </Form.Item>

              <Form.Item label="Subcategories" name="subcategories">
                <Input placeholder="Optional subcategories..." />
              </Form.Item>
            </div>

            {/* Featured Image */}
            <Form.Item label="Featured Image" name="featuredImage">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>

            {/* Excerpt */}
            <Form.Item label="Excerpt" name="excerpt">
              <Input.TextArea
                rows={3}
                placeholder="Short summary of the post..."
                className="resize-none"
              />
            </Form.Item>

            {/* SEO Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span>
                    SEO Title&nbsp;
                    <Tooltip title="Appears as the page title in search engines">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="seoTitle"
              >
                <Input placeholder="Optional SEO title" />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Meta Description&nbsp;
                    <Tooltip title="Brief summary for search engine results">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="metaDescription"
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Meta description for SEO"
                  className="resize-none"
                />
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>

      {/* Sidebar Publish Panel */}
      <div className="space-y-6 lg:sticky top-20 h-fit">
        <Card title="Publish Options" className="shadow-md rounded-xl">
          <Form.Item>
            <Checkbox
              checked={isDraft}
              onChange={(e) => setIsDraft(e.target.checked)}
            >
              Save as Draft
            </Checkbox>
          </Form.Item>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              type="primary"
              className="w-full sm:w-auto"
              onClick={() => form.submit()}
            >
              {isDraft ? "Save Draft" : "Publish"}
            </Button>
            <Button
              danger
              className="w-full sm:w-auto"
              onClick={() => {
                form.resetFields();
                setIsDraft(true);
                setFileList([]);
                message.info("Form reset");
              }}
            >
              Reset
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
