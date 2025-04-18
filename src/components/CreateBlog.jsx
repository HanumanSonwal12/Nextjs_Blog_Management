"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  Checkbox,
  message,
  Tooltip,
  Modal,
} from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { createData, updateData } from "@/utils/api";
import TextEditor from "./TextEditor";

export default function CreateBlog({
  initialData = null,
  isModalVisible = false,
  onSuccess = () => {},
  onCancel = () => {},
  isEditing = false,
}) {
  const [form] = Form.useForm();
  const [isDraft, setIsDraft] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    if (initialData && isEditing) {
      form.setFieldsValue({
        title: initialData.title,
        // content: initialData.content,
        tags: initialData.tags?.join(", "),
        categories: initialData.categories?.join(", "),
        subcategories: initialData.subcategories?.join(", "),
        excerpt: initialData.excerpt,
        seoTitle: initialData.seoTitle,
        metaDescription: initialData.metaKeywords,
      });
      setEditorContent(initialData.content || "");
      setIsDraft(initialData.status === "draft");

      if (initialData.image) {
        setFileList([
          {
            uid: "-1",
            name: initialData.image,
            status: "done",
            url: initialData.image,
          },
        ]);
      }
    } else {
      form.resetFields();
      setIsDraft(true);
      setFileList([]);
    }
  }, [initialData, isEditing, form]);

  const handleFinish = async (values) => {
    const formattedData = {
      ...(initialData || {}),
      title: values.title,
      content: editorContent,
      tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
      categories: values.categories
        ? values.categories.split(",").map((cat) => cat.trim())
        : [],
      subcategories: values.subcategories
        ? values.subcategories.split(",").map((sub) => sub.trim())
        : [],
      excerpt: values.excerpt,
      seoTitle: values.seoTitle,
      metaDescription: values.metaKeywords,
      image: fileList.length > 0 ? fileList[0].name : null,
      status: isDraft ? "draft" : "published",
    };

    try {
      if (isEditing  && initialData?.id) {
        await updateData(`/blog/update/${initialData.id}`, formattedData);
        message.success(isDraft ? "Draft updated!" : "Blog updated and published!");
      } else if (createData) {
        await createData("/blog/create", formattedData);
        message.success(isDraft ? "Draft saved!" : "Blog published!");
      } else {
        throw new Error("No API method provided.");
      }

      onSuccess(formattedData);
    } catch (error) {
      console.error("Error saving blog:", error);
      message.error("Failed to save blog");
    }
  };

  const handleFinishFailed = (errorInfo) => {
    console.log("❌ Validation Failed:", errorInfo);
    message.error("Please fix the errors before submitting.");
  };

  return (
    <Modal
      title={isEditing ? "Edit Blog" : "Create New Blog"}
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
      width="80%"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        className="space-y-6"
      >
        <Form.Item
          label="Post Title"
          name="title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input size="large" placeholder="Enter blog title..." />
        </Form.Item>

        <Form.Item
          label="Post Content"
          // name="content"
          required
          validateStatus={!editorContent ? "error" : ""}
          help={!editorContent ? "Please enter content" : ""}
          // rules={[{ required: true, message: "Please enter content" }]}
        >
          {/* <Input.TextArea
            rows={10}
            placeholder="Write your content here..."
            className="resize-none"
          /> */}
          <TextEditor
    previousValue={editorContent}
    updatedValue={(content) => setEditorContent(content)}
    height={200}
  />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Form.Item
            label="Tags"
            name="tags"
            rules={[{ required: true, message: "Enter at least one tag" }]}
          >
            <Input placeholder="e.g., react, blog" />
          </Form.Item>

          <Form.Item
            label="Categories"
            name="categories"
            rules={[{ required: true, message: "Enter at least one category" }]}
          >
            <Input placeholder="e.g., Tech, Dev" />
          </Form.Item>

          <Form.Item label="Subcategories" name="subcategories">
            <Input placeholder="Optional subcategories..." />
          </Form.Item>
        </div>

        <Form.Item label="Featured Image" name="image">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>
              {fileList.length > 0 ? "Change Image" : "Upload Image"}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Excerpt" name="excerpt">
          <Input.TextArea
            rows={3}
            placeholder="Short summary of the post..."
            className="resize-none"
          />
        </Form.Item>

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
                Meta Keywords&nbsp;
                <Tooltip title="Brief summary for search engine results">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            name="metaKeywords"
          >
            <Input.TextArea
              rows={2}
              placeholder="Meta description for SEO"
              className="resize-none"
            />
          </Form.Item>
        </div>

        <div className="space-y-6">
          <Form.Item>
            <Checkbox
              checked={isDraft}
              onChange={(e) => setIsDraft(e.target.checked)}
            >
              {isEditing ? (isDraft ? "Keep as Draft" : "Save as Draft") : "Save as Draft"}
            </Checkbox>
          </Form.Item>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button type="primary" className="w-full sm:w-auto" onClick={() => form.submit()}>
              {isEditing
                ? isDraft
                  ? "Update Draft"
                  : "Update & Publish"
                : isDraft
                ? "Save Draft"
                : "Publish"}
            </Button>
            <Button className="w-full sm:w-auto" onClick={onCancel}>
              Cancel
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
        </div>
      </Form>
    </Modal>
  );
}
