import React from "react";

const InputField = ({ label, name, type, formik, width = "col-12" }) => {
  const hasError =
    (formik.touched[name] || formik.submitCount > 0) && formik.errors[name];

  return (
    <div className={`mb-3 ${width}`}>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        className={`form-control${hasError ? " is-invalid" : ""}`}
      />
      {hasError && <div className="invalid-feedback">{formik.errors[name]}</div>}
    </div>
  );
};

export default InputField;
