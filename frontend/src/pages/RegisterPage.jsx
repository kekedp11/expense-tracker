import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function RegisterPage() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        username,
        password,
      });

      alert("Register berhasil");

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Register gagal"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Expense Tracker</h1>

        <p className="auth-subtitle">
          Buat akun baru
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
            Register
          </button>
        </form>

        <div className="auth-link">
          Sudah punya akun?
          <br />

          <Link to="/">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;