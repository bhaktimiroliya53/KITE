import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import logo from "../assets/logo/kite-brand-logo.png";
import kiteBrandLogo from "../assets/logo/kite-brand-logo.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("LOGIN SUBMIT CALLED");
    console.log(formData);
    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("✅ Login Successful!");

      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img
          src={kiteBrandLogo}
          alt="KITE"
        />

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Username or Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>

        <span>
          Don’t have an account?
          <Link to="/register">Register</Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
