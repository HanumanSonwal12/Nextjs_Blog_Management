// 'use client';

// import React, { useEffect, useState } from 'react';
// import { TreeSelect, Spin } from 'antd';
// import axios from 'axios';

// const CategorySelect = ({ value, onChange, multiple = false }) => {
//   const [treeData, setTreeData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const formatTreeData = (categories) =>
//     categories.map((cat) => ({
//       title: cat.name,
//       value: cat._id,
//       key: cat._id,
//       children: cat.children ? formatTreeData(cat.children) : []
//     }));

//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get('/api/categories');
//         const formatted = formatTreeData(res.data.data || []);
//         setTreeData(formatted);
//       } catch (err) {
//         console.error('Failed to load categories', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   if (loading) return <Spin />;

//   return (
//     <TreeSelect
//       style={{ width: '100%' }}
//       value={value}
//       dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
//       treeData={treeData}
//       placeholder={multiple ? "Select categories" : "Select category"}
//       treeDefaultExpandAll
//       onChange={onChange}
//       multiple={multiple}
//       treeCheckable={multiple}
//       showCheckedStrategy={multiple ? TreeSelect.SHOW_PARENT : undefined}
//     />
//   );
// };

// export default CategorySelect;


'use client';

import React, { useEffect, useState } from 'react';
import { TreeSelect, Spin } from 'antd';
import axios from 'axios';

const CategorySelect = ({ value, onChange, multiple = false, placeholder }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Format the categories into TreeSelect compatible format
  const formatTreeData = (categories) =>
    categories.map((cat) => ({
      title: cat.name,
      value: cat._id,
      key: cat._id,
      children: cat.children ? formatTreeData(cat.children) : []
    }));

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/categories');
        const formatted = formatTreeData(res.data.data || []);
        setTreeData(formatted);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Spin />;

  // If no initial categories or value provided, set blank for new mode
  const initialValue = value || (multiple ? [] : undefined);

  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={initialValue} // Use blank if no value, else use the passed value
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder={placeholder || (multiple ? "Select categories" : "Select category")}
      treeDefaultExpandAll
      onChange={onChange}
      multiple={multiple}
      treeCheckable={multiple}
      showCheckedStrategy={multiple ? TreeSelect.SHOW_PARENT : undefined}
    />
  );
};

export default CategorySelect;
