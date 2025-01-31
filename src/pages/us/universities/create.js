import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/InputField";
import AdminSidebar from "../../../components/AdminSidebar";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateUniversity() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      rank: "",
      name: "",
      state: "",
      logo: "",
      country: "US",
    },
    validationSchema: Yup.object({
      rank: Yup.number().required("Rank is required"),
      name: Yup.string().required("University name is required"),
      state: Yup.string().required("State is required"),
      logo: Yup.string().url("Invalid URL").required("Logo URL is required"),
      country: Yup.string().required("Country is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post("/api/universities", values);
        console.log("University created successfully:", response.data);
        router.push("/us/universities/list");
      } catch (error) {
        console.error("Error creating university:", error);
      }
      setIsSubmitting(false);
    },
  });

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="container-fluid p-4" style={{ flex: 1, background: "#f8f9fa" }}>
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Create University</h4>
          </div>
          <div className="row p-4">
            <form className="row" onSubmit={formik.handleSubmit}>
              <InputField label="Rank" name="rank" type="number" width="col-6" formik={formik} />
              <InputField label="Name" name="name" type="text" width="col-6" formik={formik} />
              <InputField label="State" name="state" type="text" width="col-6" formik={formik} />
              <InputField label="Logo URL" name="logo" type="text" width="col-6" formik={formik} />
              <InputField label="Country" name="country" type="text" width="col-6" formik={formik} disabled />
              <button type="submit" className="btn btn-primary col-2 w-100" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create University"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
