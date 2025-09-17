import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Notyf } from "notyf";

export default function Signup() {
  const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const notyf = new Notyf();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/signup", { fullname, mobile, email, password });
      notyf.success("Signup successful!");
      navigate("/");
    } catch (err) {
      notyf.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Signup</h1>
        <input type="text" placeholder="Full Name"
          className="p-3 w-full border rounded" value={fullname}
          onChange={(e) => setFullname(e.target.value)} />
        <input type="text" placeholder="Mobile"
          className="p-3 w-full border rounded" value={mobile}
          onChange={(e) => setMobile(e.target.value)} />
        <input type="email" placeholder="Email"
          className="p-3 w-full border rounded" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password"
          className="p-3 w-full border rounded" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-violet-600 text-white py-2 rounded">Signup</button>
        <p className="text-center">Already have an account? <Link to="/" className="text-blue-500">Login</Link></p>
      </form>
    </div>
  );
}
