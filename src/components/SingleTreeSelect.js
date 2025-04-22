import { TreeSelect } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SingleTreeSelect({
    value,
    onChange,
    multiple = true,
    placeholder = "Select Category",
    className
  }) {
    const [categories, setCategories] = useState([]);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await axios.get("/api/categories");
          if (res.data.success) {
            const formatTree = (data) =>
              data.map((item) => ({
                title: item.name,
                value: item._id,
                key: item._id,
                children: item.children ? formatTree(item.children) : [],
              }));
            setCategories(formatTree(res.data.data));
          }
        } catch (error) {
          console.error("Failed to load categories", error);
        }
      };
  
      fetchCategories();
    }, []);
  
    return (
      <TreeSelect
        treeData={categories}
        {...(multiple
          ? {
              treeCheckable: true,
              multiple: true,
              showCheckedStrategy: TreeSelect.SHOW_PARENT,
            }
          : {})}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        allowClear
        style={{ width: "100%" }}
        className={className}
      />
    );
  }
  
