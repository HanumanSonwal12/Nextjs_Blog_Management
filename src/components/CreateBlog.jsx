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
  TreeSelect,
  Select
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { createData, updateData } from "@/utils/api";
import TextEditor from "./TextEditor";
import UploadImage from "./UploadImage";
import axios from "axios";

export default function CreateBlog({
  initialData = null,
  isModalVisible = false,
  onSuccess = () => { },
  onCancel = () => { },
  isEditing = false,
}) {
  const [form] = Form.useForm();
  const [isDraft, setIsDraft] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const [tagsList, setTagsList] = useState([]);



  // Handle image upload success
  const handleUploadSuccess = (url) => {
    form.setFieldsValue({ image: url });
  };

  // Fetch categories from API and convert to TreeSelect format
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories"); 
        if (res.data.success) {
          const convertToTreeData = (data) =>
            data.map((item) => ({
              title: item.name,
              value: item._id,
              key: item._id,
              children: item.children ? convertToTreeData(item.children) : [],
            }));
          setCategoriesTree(convertToTreeData(res.data.data));
          setCategoriesLoaded(true);

        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    const fetchTags = async () => {
      try {
        const res = await axios.get("/api/tag"); 
        if (res.data.success && res.data.tags) {
          const formattedTags = res.data.tags.map((tag) => ({
            label: tag.name,
            value: tag.name,
          }));
          setTagsList(formattedTags);
        }
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };



    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    if (initialData && isEditing && categoriesLoaded) {
      form.setFieldsValue({
        title: initialData.title,
        tags: initialData.tags || [],
        categories: initialData.categories?.map(cat => (typeof cat === 'object' ? cat._id : cat)) || [],
                excerpt: initialData.excerpt,
        seoTitle: initialData.seoTitle,
        metaKeywords: initialData.metaKeywords,
        image: initialData.image,
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
      } else {
        setFileList([]);
      }
    }  else if (!isEditing) {
      form.resetFields();
      setEditorContent("");
      setIsDraft(true);
      setFileList([]);
    }
  }, [initialData, isEditing, form, categoriesLoaded]);

  const handleFinish = async (values) => {
    const formattedData = {
      ...(initialData || {}),
      title: values.title,
      content: editorContent,
      tags: values.tags || [],
      categories: values.categories || [],
      excerpt: values.excerpt,
      seoTitle: values.seoTitle,
      metaKeywords: values.metaKeywords,
      image: fileList.length > 0 ? fileList[0].url || fileList[0].name : null,
      status: isDraft ? "draft" : "published",
    };
   

    try {
      if (isEditing && initialData?.id) {
        await updateData(`/blog/update/${initialData.id}`, formattedData);
        message.success(isDraft ? "Draft updated!" : "Blog updated and published!");
      } else {
        await createData("/blog/create", formattedData);
        message.success(isDraft ? "Draft saved!" : "Blog published!");
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
          required
          validateStatus={!editorContent ? "error" : ""}
          help={!editorContent ? "Please enter content" : ""}
        >
          <TextEditor
            previousValue={editorContent}
            updatedValue={(content) => setEditorContent(content)}
            height={200}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please upload a featured image!" }]}
            valuePropName="image"
            getValueFromEvent={(e) => e}
          >
            <UploadImage
              fileList={fileList}
              setFileList={setFileList}
              onUploadSuccess={handleUploadSuccess}
            />
          </Form.Item>
          <Form.Item
            label="Tags"
            name="tags"
            rules={[{ required: true, message: "Enter at least one tag" }]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Add tags"
              options={tagsList}
            />

          </Form.Item>

          <Form.Item
            label="Categories"
            name="categories"
            rules={[{ required: true, message: "Select at least one category" }]}
          >
            <TreeSelect
              treeData={categoriesTree}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              placeholder="Select categories"
              allowClear
              style={{ width: "100%" }}
            />
          </Form.Item>


        </div>



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
              {isEditing
                ? isDraft
                  ? "Keep as Draft"
                  : "Save as Draft"
                : "Save as Draft"}
            </Checkbox>
          </Form.Item>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              type="primary"
              className="w-full sm:w-auto"
              style={{ backgroundColor: "#f04d23" }}
              onClick={() => form.submit()}
            >
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
