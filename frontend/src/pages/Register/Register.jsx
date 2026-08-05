import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import logo from "../assets/logo/kite-brand-logo.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
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

    try {
      const res = await API.post("/auth/register", formData);

      alert(res.data.message);

      navigate("/");
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);

      alert(JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="KITE" className="logo" />

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Register</button>
        </form>

        <span>
          Already have an account?
          <Link to="/">Login</Link>
        </span>
      </div>
    </div>
  );
}

export default Register;
