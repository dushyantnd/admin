import dynamic from "next/dynamic";
import React from "react";

// Dynamically import Froala Editor
const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

// Dynamically import Froala plugins (client-side only)
if (typeof window !== "undefined") {
  require("froala-editor/js/plugins/code_view.min.js");
  require("froala-editor/js/plugins/image.min.js");
  require("froala-editor/js/plugins/video.min.js");
  require("froala-editor/js/plugins/table.min.js");
  require("froala-editor/js/plugins/link.min.js"); // Enable link plugin
}

// Load plugins dynamically
if (typeof window !== "undefined") {
  require("froala-editor/js/plugins/code_view.min.js");
  require("froala-editor/js/plugins/image.min.js");
  require("froala-editor/js/plugins/video.min.js");
  require("froala-editor/js/plugins/table.min.js");
  require("froala-editor/js/plugins/link.min.js"); // Enable link plugin
}

const FroalaEditorComponent = ({ label, name, formik }) => {
  const handleModelChange = (newContent) => {
    formik.setFieldValue(name, newContent); // Correctly set the field value
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <FroalaEditor
        model={formik.values[name]} // Bind Formik value to the editor
        onModelChange={handleModelChange}
        config={{
          placeholderText: "Type your content here...",
          charCounterCount: true,
          toolbarInline: false,
          toolbarSticky: true,
          toolbarButtons: [
            "bold",
            "italic",
            "underline",
            "strikeThrough",
            "fontFamily",
            "fontSize",
            "color",
            "paragraphFormat",
            "align",
            "formatOL",
            "formatUL",
            "insertLink", // Enable Insert Link button
            "insertImage",
            "insertVideo",
            "insertTable",
            "html", // Enables HTML Source View
          ],
          pluginsEnabled: [
            "align",
            "charCounter",
            "codeView",
            "colors",
            "draggable",
            "emoticons",
            "fontAwesome",
            "fontFamily",
            "fontSize",
            "image",
            "link", // Enable link plugin
            "lists",
            "paragraphFormat",
            "quote",
            "table",
            "url",
            "video",
          ],
          linkInsertButtons: ["linkBack"], // Back button when adding a link
          linkEditButtons: ["linkOpen", "linkEdit", "linkRemove"], // Allow link editing options
          linkAlwaysNoFollow: false, // Disable "nofollow" by default
          linkAlwaysBlank: true, // Open links in a new tab
          linkAutoPrefix: "https://", // Auto-prefix links
          linkMultipleStyles: false, // Avoid multiple link styles
          imageUpload: true,
          videoUpload: true,
          fileUpload: true,
          imageUploadURL: "/api/upload_image", // Add your backend API endpoint
          videoUploadURL: "/api/upload_video", // Add your backend API endpoint
          fileUploadURL: "/api/upload_file",   // Add your backend API endpoint
        }}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export default FroalaEditorComponent;
