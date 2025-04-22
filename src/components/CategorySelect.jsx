// import { TreeSelect } from "antd";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function CategorySelect({
//   value,
//   onChange,
//   multiple = true,
//   placeholder = "Select Category",
// }) {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("/api/categories");
//         if (res.data.success) {
//           const formatTree = (data) =>
//             data.map((item) => ({
//               title: item.name,
//               value: item._id,
//               key: item._id,
//               children: item.children ? formatTree(item.children) : [],
//             }));
//           setCategories(formatTree(res.data.data));
//         }
//       } catch (error) {
//         console.error("Failed to load categories", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleChange = (val) => {
    
//     if (multiple) {
//       onChange(val.map((item) => item.value));
//     } else {
//       onChange(val?.value || null); 
//     }
//   };

//   return (
//     <TreeSelect
//       treeData={categories}
//       treeCheckable={multiple}
//       multiple={multiple}
//       treeCheckStrictly={true}
//       showCheckedStrategy={TreeSelect.SHOW_PARENT}
//       value={
//         multiple
//           ? value?.map((val) => ({ label: "", value: val })) 
//           : value
//           ? { label: "", value }
//           : null
//       }
//       onChange={handleChange}
//       placeholder={placeholder}
//       allowClear
//       style={{ width: "100%" }}
//     />
//   );
// }





import { TreeSelect, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import CategoryForm from "./CategoryForm";

export default function CategorySelect({
  value,
  onChange,
  multiple = true,
  placeholder = "Select Category",
}) {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ✅ Moved outside useEffect so it can be reused
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (val) => {
    if (multiple) {
      onChange(val.map((item) => item.value));
    } else {
      onChange(val?.value || null);
    }
  };

  const handleCategorySuccess = () => {
    setIsModalVisible(false);
    fetchCategories(); // ✅ Refresh category list after modal success
  };

  return (
    <>
      <TreeSelect
        treeData={categories}
        treeCheckable={multiple}
        multiple={multiple}
        treeCheckStrictly={true}
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
        value={
          multiple
            ? value?.map((val) => ({ label: "", value: val }))
            : value
            ? { label: "", value }
            : null
        }
        onChange={handleCategoryChange}
        placeholder={placeholder}
        allowClear
        style={{ width: "100%" }}
      />

      <Button type="link" onClick={() => setIsModalVisible(true)}>
        + Add New Category
      </Button>

      <CategoryForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={handleCategorySuccess}
      />
    </>
  );
}
