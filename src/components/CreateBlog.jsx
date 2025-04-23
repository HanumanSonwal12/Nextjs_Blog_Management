"use client";
import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Tooltip,
  Modal,
  Spin,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import { createData, updateData } from "@/utils/api";
import TextEditor from "./TextEditor";
import UploadImage from "./UploadImage";
import CategorySelect from "./CategorySelect";
import TagSelect from "./TagSelect";

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
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(initialData ," blog initialData")

  useEffect(() => {
    if (initialData && isEditing) {
      form.setFieldsValue({
        ...initialData,
        image: initialData.image,
        categories: initialData.categories?.map((cat) => cat._id) || [],
      });
      setEditorContent(initialData.content || "");
      setIsDraft(initialData.status === "draft");

      if (initialData.image) {
        setFileList([
          {
            uid: "-1",
            name: initialData.image.split("/").pop(),
            status: "done",
            url: initialData.image,
          },
        ]);
      }
    } else {
      form.resetFields();
      setEditorContent("");
      setIsDraft(true);
      setFileList([]);
    }
  }, [initialData, isEditing, form]);

  const handleUploadSuccess = (url) => {
    form.setFieldsValue({ image: url });
    setImageUrl(url);
    setFileList([
      {
        uid: "-1",
        name: url.split("/").pop(),
        status: "done",
        url,
      },
    ]);
  };

  const handleFinish = async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      ...(initialData || {}),
      ...values,
      content: editorContent,
      image: imageUrl || null,
      status: isDraft ? "draft" : "published",
    };

    try {
      if (isEditing && initialData?.id) {
        await updateData(`/blog/update/${initialData.id}`, payload);
        message.success(isDraft ? "Draft updated!" : "Blog updated!");
      } else {
        await createData("/blog/create", payload);
        message.success(isDraft ? "Draft saved!" : "Blog published!");
      }
      onSuccess(payload);
    } catch (error) {
      console.error("Error saving blog:", error);
      message.error("Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Editss Blog" : "Create New Blog"}
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
      width={900}
      className="wp-style-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={() =>
          message.error("Please fix the errors before submitting.")
        }
        className="wp-post-form"
      >
        <div className="wp-form-container grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Title */}
            <Form.Item
              label="Post Title"
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input size="large" placeholder="Enter blog title..." />
            </Form.Item>

            {/* Editor */}
            <Form.Item
              label="Post Content"
              required
              validateStatus={!editorContent ? "error" : ""}
              help={!editorContent ? "Please enter content" : ""}
            >
              <TextEditor
                previousValue={editorContent}
                updatedValue={setEditorContent}
                height={350}
              />
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
              <Input.TextArea rows={3} placeholder="Meta description for SEO" />
            </Form.Item>
          </div>

          <div className="lg:col-span-1">
            {/* Publishing */}
            <div className="wp-metabox">
              <h3 className="wp-metabox-title">Publishing</h3>
              <Form.Item className="mb-2">
                <Checkbox
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                >
                  {isEditing
                    ? isDraft
                      ? "Keep as Draft"
                      : "Save as Draft"
                    : "Save as Draft"}
                </Checkbox>
              </Form.Item>

              <div className="flex flex-col gap-3 mt-4">
                <Button
                  type="primary"
                  style={{ backgroundColor: "#f04d23" }}
                  onClick={() => form.submit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spin size="small" />
                  ) : isEditing ? (
                    isDraft ? "Update Draft" : "Update & Publish"
                  ) : isDraft ? (
                    "Save Draft"
                  ) : (
                    "Publish"
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button onClick={onCancel}>Cancel</Button>
                  <Button
                    danger
                    onClick={() => {
                      form.resetFields();
                      setEditorContent("");
                      setIsDraft(true);
                      setFileList([]);
                      message.info("Form reset");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="wp-metabox mt-4">
              <h3 className="wp-metabox-title">Featured Image</h3>
              <Form.Item
                name="image"
                rules={[
                  { required: true, message: "Please upload a featured image!" },
                ]}
              >
                <UploadImage
                  fileList={fileList}
                  setFileList={setFileList}
                  onUploadSuccess={handleUploadSuccess}
                />
              </Form.Item>
            </div>

            {/* Categories */}
            <div className="wp-metabox mt-4">
              <h3 className="wp-metabox-title">Categories</h3>
              <Form.Item
                name="categories"
                rules={[
                  { required: true, message: "Select at least one category" },
                ]}
              >
                <CategorySelect multiple={true} />
              </Form.Item>
            </div>

            {/* Tags */}
            <div className="wp-metabox mt-4">
              <h3 className="wp-metabox-title">Tags</h3>
              <Form.Item
                name="tags"
                rules={[{ required: true, message: "Select at least one tag" }]}
              >
                <TagSelect mode="multiple" />
              </Form.Item>
            </div>

            {/* SEO Title */}
            <div className="wp-metabox mt-4">
              <h3 className="wp-metabox-title">SEO Settings</h3>
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
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
