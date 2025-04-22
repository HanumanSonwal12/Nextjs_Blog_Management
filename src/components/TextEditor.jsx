'use client';
import React, { useEffect, useState } from "react";
import "suneditor/dist/css/suneditor.min.css";
import dynamic from 'next/dynamic';

// ❌ Ye galti thi: Do baar same naam se import
// import SunEditor from "suneditor-react"; 

// ✅ Correct dynamic import with SSR disabled
const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

const TextEditor = ({ previousValue = "a", updatedValue, height }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (content) => {
    updatedValue(content);
  };

  if (!isClient) {
    return null; 
  }

  return (
    <SunEditor
      setContents={previousValue}
      onChange={handleChange}
      setOptions={{
        height: height || 200,
        buttonList: [
          ["undo", "redo", "font", "fontSize", "formatBlock", "align"],
          [
            "bold",
            "underline",
            "italic",
            "strike",
            "subscript",
            "superscript",
            "removeFormat",
          ],
          [
            "fontColor",
            "hiliteColor",
            "outdent",
            "indent",
            "align",
            "horizontalRule",
            "list",
            "table",
          ],
          [
            "link",
            "image",
            "video",
            "fullScreen",
            "showBlocks",
            "codeView",
            "preview",
            "print",
            "save",
          ],
        ],
      }}
    />
  );
};

export default TextEditor;
