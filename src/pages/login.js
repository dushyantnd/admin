import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";

export default function Login() {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values); // Handle login
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={formik.handleSubmit}>
            <InputField
              label="Email Address"
              name="email"
              type="email"
              formik={formik}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              formik={formik}
            />
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
