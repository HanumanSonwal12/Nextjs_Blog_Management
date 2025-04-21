// "use client";

// import { Upload, message } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { useState } from "react";

// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

// const UploadImage = ({ onUploadSuccess }) => {
//   const [previewImage, setPreviewImage] = useState('');
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleChange = async ({ file, fileList: newFileList }) => {
//     setFileList(newFileList);

//     if (file.status === "uploading") {
//       setLoading(true);
//       return;
//     }

//     if (file.status === "done") {
//       const url = file.response?.url;
//       if (url) {
//         setPreviewImage(url);
//         onUploadSuccess(url);
//         setLoading(false);
//       }
//     }
//   };

//   const handleCustomRequest = async ({ file, onSuccess, onError }) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         onSuccess(data, file);
//         message.success("Upload successful");
//       } else {
//         message.error(data.error || "Upload failed");
//         onError(data.error);
//       }
//     } catch (err) {
//       message.error("Upload error");
//       onError(err);
//     }
//   };

//   return (
//     <Upload
//       listType="picture-card"
//       fileList={fileList}
//       customRequest={handleCustomRequest}
//       onChange={handleChange}
//       showUploadList={{ showPreviewIcon: false }}
//       accept="image/*"
//     >
//       {fileList.length >= 1 ? null : (
//         <div>
//           <PlusOutlined />
//           <div style={{ marginTop: 8 }}>{loading ? "Uploading" : "Upload"}</div>
//         </div>
//       )}
//     </Upload>
//   );
// };

// export default UploadImage;


"use client";

import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const UploadImage = ({ fileList, setFileList, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = async ({ file, fileList: newFileList }) => {
    setFileList(newFileList);

    if (file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (file.status === "done") {
      const url = file.response?.url;
      if (url) {
        onUploadSuccess(url);
        setLoading(false);
      }
    }
  };

  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(data, file);
        message.success("Upload successful");
      } else {
        message.error(data.error || "Upload failed");
        onError(data.error);
      }
    } catch (err) {
      message.error("Upload error");
      onError(err);
    }
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      customRequest={handleCustomRequest}
      onChange={handleChange}
      showUploadList={{ showPreviewIcon: false }}
      accept="image/*"
      previewFile={(file) => {
        return file.thumbUrl || file.url || Promise.resolve('');
      }}
    >
      {fileList.length >= 1 ? null : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>{loading ? "Uploading" : "Upload"}</div>
        </div>
      )}
    </Upload>
  );
};

export default UploadImage;

