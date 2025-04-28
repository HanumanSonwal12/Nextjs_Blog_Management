"use client";
import { Collapse, Select, DatePicker, Row, Col, Button, Input } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AdvancedFilters({ handleFilterChange }) {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  console.log(categoryOptions , tagOptions ,"filtes option")

  const [selectedFilters, setSelectedFilters] = useState({
    search: "",
    status: "All",
    category: null,
    tag: null,
    fromDate: null,
    endDate: null,
  });

  const statusOptions = [
    { id: "All", name: "All" },
    { id: "Draft", name: "Draft" },
    { id: "Publish", name: "Publish" },
  ];

  // Fetch categories and tags only
  useState(() => {
    const fetchOptions = async () => {
      try {
        const [categoryRes, tagRes] = await Promise.all([axios.get("/api/categories"), axios.get("/api/tag")]);
    
        // Ensure categories are fetched correctly and format them properly
        if (Array.isArray(categoryRes.data.data)) {
          const formattedCategories = categoryRes.data.data.map((cat) => ({
            title: cat.name, // Use 'title' instead of 'label' for TreeSelect
            value: cat._id,
            children: cat.children?.map((child) => ({
              title: child.name, // 'title' for subcategories as well
              value: child._id,
            })),
          }));
    
          setCategoryOptions(formattedCategories);
        } else {
          console.error("Categories response is not in the expected format", categoryRes.data);
        }
    
        // Ensure tags are set correctly
        if (Array.isArray(tagRes.data)) {
          setTagOptions(tagRes.data); // Assuming tags are directly in `data`
        } else {
          console.error("Tags response is not in the expected format", tagRes.data);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    
    fetchOptions();
  }, []);

  const handleSelectChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    handleFilterChange(key, value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSelectedFilters((prev) => ({ ...prev, search: value }));
    handleFilterChange("search", value);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      const formattedStart = start ? start.format("MM/DD/YYYY") : null;
      const formattedEnd = end ? end.format("MM/DD/YYYY") : null;
      setSelectedFilters((prev) => ({
        ...prev,
        fromDate: start,
        endDate: end,
      }));
      handleFilterChange("fromDate", formattedStart);
      handleFilterChange("endDate", formattedEnd);
    } else {
      setSelectedFilters((prev) => ({ ...prev, fromDate: null, endDate: null }));
      handleFilterChange("fromDate", "");
      handleFilterChange("endDate", "");
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: "",
      status: "All",
      category: null,
      tag: null,
      fromDate: null,
      endDate: null,
    };
    setSelectedFilters(defaultFilters);
    Object.keys(defaultFilters).forEach((key) => {
      handleFilterChange(key, defaultFilters[key]);
    });
  };

  const items = [
    {
      key: "1",
      label: "Advanced Filters",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <Input
                placeholder="Search by title..."
                value={selectedFilters.search}
                onChange={handleSearchChange}
              />
            </Col>
            <Col span={6}>
              <Select
                className="w-full"
                placeholder="Filter by Status"
                value={selectedFilters.status}
                onChange={(value) => handleSelectChange("status", value)}
                allowClear
              >
                {statusOptions.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                className="w-full"
                placeholder="Filter by Category"
                value={selectedFilters.category}
                onChange={(value) => handleSelectChange("category", value)}
                allowClear
                showSearch
              >
                {categoryOptions.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                className="w-full"
                placeholder="Filter by Tag"
                value={selectedFilters.tag}
                onChange={(value) => handleSelectChange("tag", value)}
                allowClear
                showSearch
              >
                {tagOptions.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <RangePicker
                className="w-full"
                format="MM/DD/YYYY"
                value={[
                  selectedFilters.fromDate ? dayjs(selectedFilters.fromDate) : null,
                  selectedFilters.endDate ? dayjs(selectedFilters.endDate) : null,
                ]}
                onChange={handleDateChange}
                allowClear
              />
            </Col>
          </Row>

          <Row justify="end" className="mt-4">
            <Col>
              <Button onClick={resetFilters} type="default" style={{ color: "red" }}>
                Reset all Filters
              </Button>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return <Collapse defaultActiveKey={["1"]} items={items} />;
}
