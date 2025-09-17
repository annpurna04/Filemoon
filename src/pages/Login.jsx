import { useState, useContext } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default function Login() {
  const { setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const notyf = new Notyf();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Login request
      const res = await api.post("/login", { email, password });

      // Save token in AuthContext (triggers AuthProvider to verify and set user)
      setToken(res.data.token);

      notyf.success("Login successful!");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      notyf.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl w-96 space-y-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="p-3 w-full border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="p-3 w-full border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition">
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
