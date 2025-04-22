
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
  Select,
  Spin,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { createData, updateData } from "@/utils/api";
import TextEditor from "./TextEditor";
import UploadImage from "./UploadImage";
import axios from "axios";
import CategorySelect from "./CategorySelect";

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
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [tagsList, setTagsList] = useState([]);
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [initialCategories, setInitialCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadSuccess = (url) => {
    form.setFieldsValue({ image: url });
    setImageUrl(url);
    setFileList([
      {
        uid: "-1",
        name: url.split("/").pop() || "image.jpg",
        status: "done",
        url,
      },
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/tag"),
        ]);

        if (categoriesRes.data.success) {
          const formatTree = (data) =>
            data.map((item) => ({
              title: item.name,
              value: item._id,
              key: item._id,
              children: item.children ? formatTree(item.children) : [],
            }));
          setCategoriesTree(formatTree(categoriesRes.data.data));
          setCategoriesLoaded(true);
        }

        if (tagsRes.data.success && tagsRes.data.tags) {
          setTagsList(
            tagsRes.data.tags.map((tag) => ({
              label: tag.name,
              value: tag.name,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching categories or tags", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (initialData && isEditing && categoriesLoaded) {
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
            name: initialData.image.split("/").pop() || "image.jpg",
            status: "done",
            url: initialData.image,
          },
        ]);
      }
    } else if (!isEditing) {
      form.resetFields();
      setEditorContent("");
      setIsDraft(true);
      setFileList([]);
    }
  }, [initialData, isEditing, form, categoriesLoaded]);

  const handleFinish = async (values) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const formattedData = {
      ...(initialData || {}),
      ...values,
      content: editorContent,
      image: imageUrl || null,
      status: isDraft ? "draft" : "published",
    };
   
    try {
      if (isEditing && initialData?.id) {
        await updateData(`/blog/update/${initialData.id}`, formattedData);
        message.success(
          isDraft ? "Draft updated!" : "Blog updated and published!"
        );
      } else {
        await createData("/blog/create", formattedData);
        message.success(isDraft ? "Draft saved!" : "Blog published!");
      }

      onSuccess(formattedData);
    } catch (error) {
      console.error("Error saving blog:", error);
      message.error("Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Blog" : "Create New Blog"}
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
      width="90%"
      className="wp-style-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={() => message.error("Please fix the errors before submitting.")}
        className="wp-post-form"
      >
        <div className="wp-form-container grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Form.Item
              label="Post Title"
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input 
                size="large" 
                placeholder="Enter blog title..." 
                className="wp-title-input" 
              />
            </Form.Item>

            <Form.Item
              label="Post Content"
              required
              validateStatus={!editorContent ? "error" : ""}
              help={!editorContent ? "Please enter content" : ""}
              className="content-editor-container"
            >
              <TextEditor
                previousValue={editorContent}
                updatedValue={setEditorContent}
                height={350} 
              />
            </Form.Item>

            {/* <Form.Item label="Excerpt" name="excerpt">
              <Input.TextArea 
                rows={4} 
                placeholder="Short summary of the post..."
                className="wp-excerpt" 
              />
            </Form.Item> */}
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
            <div className="wp-metabox">
              <h3 className="wp-metabox-title">Publishing</h3>
              <Form.Item className="mb-2">
                <Checkbox checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)}>
                  {isEditing ? (isDraft ? "Keep as Draft" : "Save as Draft") : "Save as Draft"}
                </Checkbox>
              </Form.Item>

              <div className="flex flex-col gap-3 mt-4">
                <Button
                  type="primary"
                  style={{ backgroundColor: "#f04d23" }}
                  onClick={() => form.submit()}
                  disabled={isSubmitting}
                  className="wp-primary-button"
                >
                  {isSubmitting ? <Spin size="small" /> : isEditing 
                    ? (isDraft ? "Update Draft" : "Update & Publish") 
                    : isDraft ? "Save Draft" : "Publish"}
                </Button>

                <div className="flex gap-2">
                  <Button onClick={onCancel}>Cancel</Button>
                  <Button
                    danger
                    onClick={() => {
                      form.resetFields();
                      setIsDraft(true);
                      setFileList([]);
                      setEditorContent("");
                      message.info("Form reset");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="wp-metabox mt-4">
              <h3 className="wp-metabox-title">Featured Image</h3>
              <Form.Item
                name="image"
                rules={[{ required: true, message: "Please upload a featured image!" }]}
              >
                <UploadImage
                  fileList={fileList}
                  setFileList={setFileList}
                  onUploadSuccess={handleUploadSuccess}
                  initialImage={initialData?.image}
                />
              </Form.Item>
            </div>

            <div className="wp-metabox mt-4">
              <h3 className="wp-metabox-title">Categories</h3>
              <Form.Item
                name="categories"
                rules={[{ required: true, message: "Select at least one category" }]}
              >
                <CategorySelect multiple={true} />
              </Form.Item>
            </div>

            <div className="wp-metabox mt-4">
              <h3 className="wp-metabox-title">Tags</h3>
              <Form.Item
                name="tags"
                rules={[{ required: true, message: "Enter at least one tag" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Add tags"
                  options={tagsList}
                  className="wp-tags-select"
                />
              </Form.Item>
            </div>

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