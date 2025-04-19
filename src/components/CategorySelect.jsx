'use client';

import React, { useEffect, useState } from 'react';
import { TreeSelect, Spin } from 'antd';
import axios from 'axios';

const CategorySelect = ({ value, onChange }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatTreeData = (categories) =>
    categories.map((cat) => ({
      title: cat.name,
      value: cat._id,
      key: cat._id,
      children: cat.children ? formatTreeData(cat.children) : []
    }));

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

  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="Please select category(s)"
      treeDefaultExpandAll
      onChange={onChange}
      multiple
      treeCheckable
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
    />
  );
};

export default CategorySelect;
