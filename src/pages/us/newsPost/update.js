import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/InputField";
import FroalaEditorComponent from "../../../components/FroalaEditorComponent";
import AdminSidebar from "../../../components/AdminSidebar";
import axios from "axios";
import { useRouter } from "next/router";
import { CldImage } from 'next-cloudinary';

export default function Update() {
  const router = useRouter();
  const { id } = router.query; // Get post ID from query params
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [featured_image, setFeatured_image] = useState(null);

  // Fetch categories
  useEffect(() => {
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
  }, []);

  // Fetch the post details
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`/api/news-posts`, { params: { id } });
        const post = response.data;
        setFeatured_image(post?.featured_image || "")
        formik.setValues({
          title: post.title,
          slug: post.slug,
          author_name: post?.author_name,
          content: post?.content,
          excerpt: post?.excerpt,
          status: post?.status,
          category_id: post?.category_id || "",
          featured_image: post?.featured_image,
          meta_title: post?.meta_title,
          meta_desc: post?.meta_desc,
          short_desc: post?.short_desc || "",
        });
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setIsLoadingPost(false);
      }
    };

    fetchPost();
  }, [id]);

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
      content: "",
      excerpt: "",
      status: "draft",
      category_id: "",
      featured_image: "",
      meta_title: "",
      meta_desc: "",
      short_desc: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      slug: Yup.string().required("Slug is required"),
      author_name: Yup.string().required("Author Name is required"),
      content: Yup.string().required("Content is required"),
      excerpt: Yup.string().required("Excerpt is required"),
      short_desc: Yup.string().required("Short Description is required"),
      category_id: Yup.string().required("Category is required"),
      status: Yup.string()
        .oneOf(["published", "draft", "pending"], "Invalid status")
        .required("Status is required"),
      featured_image: Yup.string().url("Invalid URL"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.put(`/api/news-posts?id=${id}`, { ...values, featured_image });
        if (response.data) {
          console.log("Post updated successfully:", response.data);
          router.push("/us/newsPost/list");
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
    },
  });

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Update News Post</h4>
          </div>
          <div className="row p-4">
            {isLoadingPost ? (
              <div className="text-center">Loading post details...</div>
            ) : (
              <form className="row" onSubmit={formik.handleSubmit}>
                <InputField label="Title" name="title" type="text" width="col-6" formik={formik} />
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
                <FroalaEditorComponent label="Excerpt" name="excerpt" formik={formik} />
                <FroalaEditorComponent label="Content" name="content" formik={formik} />

                <InputField
                  label="Author Name"
                  name="author_name"
                  type="text"
                  width="col-6"
                  formik={formik}
                />

                {/* Status Select */}
                <div className="mb-3 col-6">
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

                {/* Category Select */}
                <div className="mb-3 col-6">
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
                      <option key={category._id} value={category._id} selected={category._id == formik.values.category_id}>
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
                  width="col-6"
                  formik={formik}
                />

                <div className="mb-3">
                  <label className="form-label">Meta Description</label>
                  <textarea
                    name="meta_desc"
                    className="form-control"
                    rows="3"
                    onChange={formik.handleChange}
                    value={formik.values.meta_desc}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Update Post
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
