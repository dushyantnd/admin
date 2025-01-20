import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/InputField";
import dynamic from "next/dynamic";
import AdminSidebar from "../../../components/AdminSidebar";
import axios from "axios";
import { useRouter } from "next/router";
import { CldImage } from 'next-cloudinary';

// Dynamically import Froala
const FroalaEditorComponent = dynamic(() => import("../../../components/FroalaEditorComponent"), {
  ssr: false,
});

export default function CreateNewsPost() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [featured_image, setFeatured_image] = useState(false);

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchCategories = async () => {
        try {
          const response = await axios.get("/api/news-category");
          setCategories(response.data.categories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setIsLoadingCategories(false);
        }
      };

      fetchCategories();
    }
  }, []);

  // Function to convert name to slug
  const generateSlug = (value) => {
    return value
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9 ]/g, "") // Remove special characters
      .trim() // Remove leading/trailing spaces
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
        handleUpload();
      };
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: image }),
      });
      const data = await response.json();
      console.log("data",data);
      if (data.success) {
        setFeatured_image(data?.data?.secure_url);
        alert('Image uploaded successfully');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
    setUploading(false);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      author_name: "",
      short_desc: "",
      content: "",
      excerpt: "",
      status: "draft",
      category_id: "",
      featured_image: "",
      meta_title: "",
      meta_desc: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      slug: Yup.string().required("Slug is required"),
      author_name: Yup.string().required("Author Name is required"),
      content: Yup.string().required("Content is required"),
      excerpt: Yup.string().required("Excerpt is required"),
      short_desc:Yup.string().required("Short Description is required"),
      category_id: Yup.string().required("Category is required"),
      status: Yup.string()
        .oneOf(["published", "draft", "pending"], "Invalid status")
        .required("Status is required"),
      featured_image: Yup.string().url("Invalid URL"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("/api/news-posts", { ...values, featured_image });
        console.log("Post created successfully:", response.data);
        router.push("/us/newsPost/list");
      } catch (error) {
        console.error("Error creating post:", error);
      }
    },
  });

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Create News Post</h4>
          </div>
          <div className="row p-4">
            <form className="row" onSubmit={formik.handleSubmit}>
              <InputField label="Title" name="title" type="text" width="col-6" formik={{
                ...formik,
                handleChange: (e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("slug", generateSlug(e.target.value));
                },
              }} />
              <InputField label="Slug" name="slug" type="text" width="col-6" formik={formik} />
              <div className="mb-3 col-12">
                <label className="form-label">Short Description</label>
                <textarea
                  name="short_desc"
                  className="form-control"
                  rows="3"
                  onChange={formik.handleChange}
                  value={formik.values.short_desc}
                ></textarea>
                   {formik.errors.short_desc && formik.touched.short_desc && (
                  <div className="invalid-feedback">{formik.errors.short_desc}</div>
                )}
              </div>
              {typeof window !== "undefined" && (
                <>
                  <FroalaEditorComponent label="Excerpt" name="excerpt" formik={formik} />
                  <FroalaEditorComponent label="Content" name="content" formik={formik} />
                </>
              )}

              <InputField
                label="Author Name"
                name="author_name"
                type="text"
                width="col-4"
                formik={formik}
              />

              <div className="mb-3 col-4">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className={`form-select ${formik.errors.status && formik.touched.status ? "is-invalid" : ""
                    }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.status}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                </select>
                {formik.errors.status && formik.touched.status && (
                  <div className="invalid-feedback">{formik.errors.status}</div>
                )}
              </div>

              <div className="mb-3 col-4">
                <label className="form-label">Category</label>
                <select
                  name="category_id"
                  className={`form-select ${formik.errors.category_id && formik.touched.category_id ? "is-invalid" : ""
                    }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.category_id}
                  disabled={isLoadingCategories}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formik.errors.category_id && formik.touched.category_id && (
                  <div className="invalid-feedback">{formik.errors.category_id}</div>
                )}
              </div>
              <div className="mb-3 col-4">
                <label className="form-label">Image Upload</label>
                <input type="file" 
                onChange={(e)=>handleFileChange(e) }
                onBlur={(e)=>handleFileChange(e)}
                disabled={uploading}
                 />
                 {formik.errors.featured_image && formik.touched.featured_image && (
                  <div className="invalid-feedback">{formik.errors.featured_image}</div>
                )}
                 {featured_image && <CldImage src={featured_image} height={100} width={100} />}
              </div>  
              
              <InputField
                label="Meta Title"
                name="meta_title"
                type="text"
                width="col-4"
                formik={formik}
              />

              <div className="mb-3 col-4">
                <label className="form-label">Meta Description</label>
                <textarea
                  name="meta_desc"
                  className="form-control"
                  rows="3"
                  onChange={formik.handleChange}
                  value={formik.values.meta_desc}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary col-2 w-100">
                Create Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
