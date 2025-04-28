// "use client";

// import { Upload, message } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import { useState } from "react";

// const UploadImage = ({ fileList, setFileList, onUploadSuccess }) => {
//   const [loading, setLoading] = useState(false);

//   const handleChange = ({ file, fileList: newFileList }) => {
//     // ✅ Add URL for preview after upload success
//     if (file.status === "done") {
//       const uploadedUrl = file?.response?.url;

//       if (uploadedUrl) {
//         const updatedList = newFileList.map((f) => {
//           if (f.uid === file.uid) {
//             return {
//               ...f,
//               url: uploadedUrl, // 📸 Set URL for preview
//               thumbUrl: uploadedUrl,
//             };
//           }
//           return f;
//         });

//         setFileList(updatedList);
//         setLoading(false);
//         message.success("Upload successful");

//         onUploadSuccess(uploadedUrl); // 🚀 Pass URL to parent (form.setFieldsValue)
//       } else {
//         message.error("Image URL not received from server.");
//       }
//     } else {
//       setFileList(newFileList);
//     }

//     if (file.status === "error") {
//       setLoading(false);
//       message.error("Upload failed.");
//     }
//   };

//   const handleCustomRequest = async ({ file, onSuccess, onError }) => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       console.log("✅ Upload Response from Server:", data);

//       if (res.ok && data?.url) {
//         onSuccess({ url: data.url }); // ✅ response.url pass karo
//       } else {
//         onError(data?.error || "Upload failed");
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
//       showUploadList={{ showPreviewIcon: true }}
//       accept="image/*"
//     >
//       {fileList.length >= 1 ? null : (
//         <div>
//           <PlusOutlined />
//           <div style={{ marginTop: 8 }}>{loading ? "Uploading..." : "Upload"}</div>
//         </div>
//       )}
//     </Upload>
//   );
// };

// export default UploadImage;



// "use client";

// import { Upload, message, Button } from "antd";
// import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useEffect, useState } from "react";

// const UploadImage = ({ fileList, setFileList, onUploadSuccess, initialImage }) => {
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (initialImage) {
//       setFileList([
//         {
//           uid: "-1",
//           name: "uploaded_image.jpg",
//           status: "done",
//           url: initialImage,
//           thumbUrl: initialImage,
//         },
//       ]);
//     }
//   }, [initialImage]);

//   const handleChange = ({ file, fileList: newFileList }) => {
//     if (file.status === "done") {
//       const uploadedUrl = file?.response?.url;
//       if (uploadedUrl) {
//         const updatedList = newFileList.map((f) =>
//           f.uid === file.uid ? { ...f, url: uploadedUrl, thumbUrl: uploadedUrl } : f
//         );
//         setFileList(updatedList);
//         setLoading(false);
//         message.success("Upload successful");
//         onUploadSuccess(uploadedUrl); // 👈 Parent ko URL pass karo
//       } else {
//         message.error("Image URL not received from server.");
//       }
//     } else {
//       setFileList(newFileList);
//     }

//     if (file.status === "error") {
//       setLoading(false);
//       message.error("Upload failed.");
//     }
//   };

//   const handleCustomRequest = async ({ file, onSuccess, onError }) => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok && data?.url) {
//         onSuccess({ url: data.url });
//       } else {
//         onError(data?.error || "Upload failed");
//       }
//     } catch (err) {
//       message.error("Upload error");
//       onError(err);
//     }
//   };

//   const handleReset = () => {
//     setFileList([]);
//     onUploadSuccess(""); // 👈 Empty URL parent ko do
//   };

//   return (
//     <div>
//       <Upload
//         listType="picture-card"
//         fileList={fileList}
//         customRequest={handleCustomRequest}
//         onChange={handleChange}
//         showUploadList={{ showPreviewIcon: true }}
//         accept="image/*"
//       >
//         {fileList.length >= 1 ? null : (
//           <div>
//             <PlusOutlined />
//             <div style={{ marginTop: 8 }}>{loading ? "Uploading..." : "Upload"}</div>
//           </div>
//         )}
//       </Upload>
//       {fileList.length > 0 && (
//         <Button danger icon={<DeleteOutlined />} onClick={handleReset}>
//           Remove
//         </Button>
//       )}
//     </div>
//   );
// };

// export default UploadImage;

"use client";

import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const UploadImage = ({ fileList, setFileList, onUploadSuccess, initialImage }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialImage) {
      setFileList([
        {
          uid: "-1",
          name: "uploaded_image.jpg",
          status: "done",
          url: initialImage,
          thumbUrl: initialImage,
        },
      ]);
    }
  }, [initialImage]);

  const handleChange = ({ file, fileList: newFileList }) => {
    if (file.status === "done") {
      const uploadedUrl = file?.response?.url;
      if (uploadedUrl) {
        const updatedList = newFileList.map((f) =>
          f.uid === file.uid ? { ...f, url: uploadedUrl, thumbUrl: uploadedUrl } : f
        );
        setFileList(updatedList);
        setLoading(false);
        message.success("Upload successful");
        onUploadSuccess(uploadedUrl);
      } else {
        message.error("Image URL not received from server.");
      }
    } else {
      setFileList(newFileList);
    }

    if (file.status === "error") {
      setLoading(false);
      message.error("Upload failed.");
    }
  };

  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data?.url) {
        onSuccess({ url: data.url });
      } else {
        onError(data?.error || "Upload failed");
      }
    } catch (err) {
      message.error("Upload error");
      onError(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        customRequest={handleCustomRequest}
        onChange={handleChange}
        accept="image/*"
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8, color: "#999" }}>
              {loading ? "Uploading..." : "Upload"}
            </div>
          </div>
        )}
      </Upload>
    </div>
  );
};

export default UploadImage;