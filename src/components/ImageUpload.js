import { useState } from "react";

export default function ImageUpload({ field, form, label }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

    // Convert file to base64
    const base64 = await toBase64(file);

    // Update Formik's field value with the base64 string
    form.setFieldValue(field.name, base64);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div>
      {label && <label>{label}</label>}
      <input type="file" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: 200 }} />}
      {form.errors[field.name] && form.touched[field.name] && (
        <div style={{ color: "red" }}>{form.errors[field.name]}</div>
      )}
    </div>
  );
}
