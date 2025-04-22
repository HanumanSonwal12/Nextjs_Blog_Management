import { TreeSelect } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CategorySelect({
  value,
  onChange,
  multiple = true,
  placeholder = "Select Category",
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

  const handleChange = (val) => {
    
    if (multiple) {
      onChange(val.map((item) => item.value));
    } else {
      onChange(val?.value || null); 
    }
  };

  return (
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
      onChange={handleChange}
      placeholder={placeholder}
      allowClear
      style={{ width: "100%" }}
    />
  );
}


// // import { TreeSelect } from "antd";
// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // export default function CategorySelect({
// //   value,
// //   onChange,
// //   multiple = true,
// //   placeholder = "Select Category",
// // }) {
// //   const [categories, setCategories] = useState([]);

// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         const res = await axios.get("/api/categories");
// //         if (res.data.success) {
// //           const formatTree = (data) =>
// //             data.map((item) => ({
// //               title: item.name,
// //               value: item._id,
// //               key: item._id,
// //               children: item.children ? formatTree(item.children) : [],
// //             }));
// //           setCategories(formatTree(res.data.data));
// //         }
// //       } catch (error) {
// //         console.error("Failed to load categories", error);
// //       }
// //     };

// //     fetchCategories();
// //   }, []);

// //   const handleChange = (val) => {
// //     if (multiple) {
// //       // For multiple selection, pass an array of values
// //       onChange(val.map((item) => item.value));
// //     } else {
// //       // For single selection, pass a single value (or null)
// //       onChange(val ? val.value : null);
// //     }
// //   };

// //   return (
// //     <TreeSelect
// //       treeData={categories}
// //       treeCheckable={multiple}
// //       multiple={multiple}
// //       treeCheckStrictly={true}
// //       showCheckedStrategy={TreeSelect.SHOW_PARENT}
// //       value={multiple
// //         ? value?.map((val) => ({ label: "", value: val })) // For multiple selection, format as array of objects
// //         : value
// //         ? { label: "", value } // For single selection, format as a single object
// //         : null}
// //       onChange={handleChange}
// //       placeholder={placeholder}
// //       allowClear
// //       style={{ width: "100%" }}
// //     />
// //   );
// // }


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
//       // Multiple selection, val is an array of selected items
//       onChange(val);
//     } else {
//       // Single selection, val is a single value
//       onChange(val);
//     }
//   };

//   return (
//     <TreeSelect
//       treeData={categories}
//       treeCheckable={multiple} // Show checkboxes for multiple selection
//       multiple={multiple} // Allow multiple selection
//       treeCheckStrictly={true}
//       showCheckedStrategy={TreeSelect.SHOW_PARENT}
//       value={multiple ? value : value ? [value] : []} // When single, wrap value in an array
//       onChange={handleChange}
//       placeholder={placeholder}
//       allowClear
//       style={{ width: "100%" }}
//     />
//   );
// }




