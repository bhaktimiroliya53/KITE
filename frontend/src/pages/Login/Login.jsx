import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/user/auth.css";
import kiteBrandLogo from "../../assets/logo/kite-brand-logo.png";
import { useLoader } from "../../context/LoaderContext";

function Login() {
  const navigate = useNavigate();

  const { showLoader, hideLoader } = useLoader();

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

    showLoader();

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setTimeout(() => {
        hideLoader();
        navigate("/home");
      }, 1200);

    } catch (error) {
      hideLoader();
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img
          src={kiteBrandLogo}
          alt="KITE"
          className="logo"
        />

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Username or Email"
            value={formData.identifier}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>

        <span>
          Don't have an account?
          <Link to="/register"> Register</Link>
        </span>
      </div>
    </div>
  );
}

export default Login;