import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import schoolsDepartments from "../../data/schoolsDepartments";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "faculty",
      school: "",
      department: ""
    });

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    if (name === "role") {

      setFormData({
        ...formData,
        role: value,
        school: "",
        department: ""
      });

      return;
    }

    if (name === "school") {

      setFormData({
        ...formData,
        school: value,
        department: ""
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      // Full Name

      if (
        !formData.name.trim()
      ) {
        alert(
          "Please enter Full Name"
        );
        return;
      }

      // Email

      if (
        !formData.email.trim()
      ) {
        alert(
          "Please enter Email"
        );
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          formData.email
        )
      ) {
        alert(
          "Please enter valid Email"
        );
        return;
      }

      // Password

      if (
        !formData.password
      ) {
        alert(
          "Please enter Password"
        );
        return;
      }

      if (
        formData.password.length < 6
      ) {
        alert(
          "Password must contain at least 6 characters"
        );
        return;
      }

      // School

      if (
        !formData.school
      ) {
        alert(
          "Please select School"
        );
        return;
      }

      // Department

      if (
        formData.role !== "dean" &&
        !formData.department
      ) {
        alert(
          "Please select Department"
        );
        return;
      }

      try {

        await registerUser(
          formData
        );

        alert(
          "Registration Successful"
        );

        navigate(
          "/login"
        );

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Registration Failed"
        );

      }
    };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#2563eb,#1e3a8a)",
        padding: "20px"
      }}
    >

      <div
        style={{
          width: "550px",
          background: "#fff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.2)"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px"
          }}
        >
          SRIHER IQAC
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px"
          }}
        >
          Create New Account
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={
              handleChange
            }
            style={inputStyle}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={
              handleChange
            }
            style={inputStyle}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={
              handleChange
            }
            style={inputStyle}
          />

          <select
            name="role"
            value={formData.role}
            onChange={
              handleChange
            }
            style={inputStyle}
          >
            <option value="faculty">
              Faculty
            </option>

            <option value="hod">
              HOD
            </option>

            <option value="dean">
              Dean
            </option>
          </select>

          <select
            name="school"
            value={formData.school}
            onChange={
              handleChange
            }
            style={inputStyle}
          >
            <option value="">
              Select School
            </option>

            {
              Object.keys(
                schoolsDepartments
              ).map(
                (school) => (

                  <option
                    key={school}
                    value={school}
                  >
                    {school}
                  </option>

                )
              )
            }

          </select>

          {
            formData.role !== "dean" &&
            formData.school && (

              <select
                name="department"
                value={
                  formData.department
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
              >

                <option value="">
                  Select Department
                </option>

                {
                  schoolsDepartments[
                    formData.school
                  ]?.map(
                    (
                      department
                    ) => (

                      <option
                        key={
                          department
                        }
                        value={
                          department
                        }
                      >
                        {
                          department
                        }
                      </option>

                    )
                  )
                }

              </select>

            )
          }

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background:
                "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Register
          </button>

        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

export default Register;