import { useState,useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/InputField";
import FroalaEditorComponent from "../../../components/FroalaEditorComponent";
import AdminSidebar from "../../../components/AdminSidebar";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateNewsPost() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
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
  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      status: "draft",
      parent_id: "",
      featured_image: "",
      menu:"",
      meta_title: "",
      meta_desc: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      slug: Yup.string().required("Slug is required"),
      description: Yup.string().required("Description is required"),
      status: Yup.string()
        .oneOf(["published", "draft", "pending"], "Invalid status")
        .required("Status is required"),
      featured_image: Yup.string().url("Invalid URL"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("/api/news-category", values);
        console.log("Post created successfully:", response.data);
        router.push("/us/newsCategory/list");
      } catch (error) {
        console.error("Error creating post:", error);
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
            <h4 className="mb-0">Update News Category</h4>
          </div>
          <form className="row p-4" onSubmit={formik.handleSubmit}>
            <InputField label="Name" name="name" type="text" width="col-3" formik={formik} />
            <InputField label="Slug" name="slug" type="text" width="col-3" formik={formik} />
            <InputField label="menu" name="menu" type="text" width="col-3" formik={formik}  />
            <div className="mb-3 col-3">
                  <label className="form-label">Menu</label>
                  <select
                    name="menu"
                    className={`form-select ${
                      formik.errors.menu && formik.touched.menu ? "is-invalid" : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.menu}
                  >
                    <option value="">Select a category</option>
                    <option value="0">No Menu</option>
                    <option value="1">Top Menu</option>
                    <option value="2">Other Menu</option>

                  </select>
                  {formik.errors.menu && formik.touched.menu && (
                    <div className="invalid-feedback">{formik.errors.category_id}</div>
                  )}
                </div>
            {/* Category Select */}
            <div className="mb-3 col-3">
                  <label className="form-label">Category</label>
                  <select
                    name="parent_id"
                    className={`form-select ${
                      formik.errors.parent_id && formik.touched.parent_id ? "is-invalid" : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.parent_id}
                    disabled={isLoadingCategories}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id} selected={category._id == formik.values.parent_id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formik.errors.category_id && formik.touched.category_id && (
                    <div className="invalid-feedback">{formik.errors.category_id}</div>
                  )}
                </div>
            <FroalaEditorComponent label="Description" name="description" formik={formik} />
           
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
            <InputField
              label="Featured Image URL"
              name="featured_image"
              type="url"
              width="col-6"
              formik={formik}
            />
            <InputField
              label="Meta Title"
              name="meta_title"
              type="text"
              width="col-6"
              formik={formik}
            />
            <div className="mb-3 col-6">
              <label className="form-label">Meta Description</label>
              <textarea
                name="meta_desc"
                className="form-control"
                rows="3"
                onChange={formik.handleChange}
                value={formik.values.meta_desc}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Create Post
            </button>
          </form>
          </div>
        </div>
      </div>
  );
}
