import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function LoginPage() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login berhasil");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login gagal"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Expense Tracker</h1>

        <p className="auth-subtitle">
          Login untuk melanjutkan
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>
        </form>

        <div className="auth-link">
          Belum punya akun?
          <br />

          <Link to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;