"use client";

import { useEffect, useState } from "react";
import { Button, Select, Typography } from "antd";
import axios from "axios";
import TagModal from "./TagForm";

const { Text } = Typography;

const TagSelect = ({ value = [], onChange, mode = "multiple" }) => {
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/tag");
      if (data.success && Array.isArray(data.tags)) {
        setTagsList(
          data.tags.map(tag => ({
            label: tag.name,
            value: tag._id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Get selected tag IDs from tag objects
  const selectedIds = value.map(tag => tag._id);

  // When user selects/removes tags
  const handleChange = (selectedIds) => {
    const selectedTags = tagsList
      .filter(tag => selectedIds.includes(tag.value))
      .map(tag => ({
        _id: tag.value,
        name: tag.label,
      }));

    onChange(selectedTags);
  };

  return (
    <div>
      <Select
        mode={mode}
        placeholder="Select tags"
        value={selectedIds}         // show based on IDs
        onChange={handleChange}     // return {_id, name}
        options={tagsList}
        loading={loading}
        allowClear
        style={{ width: "100%" }}
      />

      <div style={{ marginTop: 6 }}>
        <Button
          type="link"
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => setTagModalVisible(true)}
        >
          + Add new tag
        </Button>
      </div>

      <TagModal
        visible={tagModalVisible}
        onClose={() => setTagModalVisible(false)}
        fetchTags={fetchTags}
      />
    </div>
  );
};

export default TagSelect;
