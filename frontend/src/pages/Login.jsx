import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import { toast } from "react-toastify";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";

import "./Login.css";


function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();


  const [form, setForm] = useState({
    username: "",
    password: "",
  });


  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {

    setForm({
      ...form,

      [e.target.name]:
        e.target.value,
    });

  };


  // =========================================================
  // HANDLE LOGIN
  // =========================================================

  const handleLogin = async (e) => {

    e.preventDefault();


    try {

      const response =
        await API.post(
          "auth/login/",
          form
        );


      console.log(
        "Login Response:",
        response.data
      );


      // =====================================
      // Save authentication
      // =====================================

      login(response.data);


      toast.success(
        "Login Successful"
      );


      // =====================================
      // Admin / User Redirect
      // =====================================

      if (
        response.data.is_staff ||
        response.data.is_superuser
      ) {

        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

      } else {

        navigate(
          "/",
          {
            replace: true,
          }
        );

      }


    } catch (error) {

      console.error(
        "Login Error:",
        error
      );


      const message =
        error.response?.data?.message ||
        "Invalid username or password";


      toast.error(message);

    }

  };


  return (

    <div className="login-container">


      <div className="login-card">


        <h1>
          📰 Fake News Detector
        </h1>


        <h2>
          Login
        </h2>


        <form
          onSubmit={handleLogin}
        >


          {/* Username */}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />


          {/* Password */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />


          {/* Login */}

          <button
            type="submit"
          >
            Login
          </button>


        </form>


        <p>

          Don't have an account?

          <Link to="/register">
            {" "}Register
          </Link>

        </p>


      </div>


    </div>

  );

}


export default Login;