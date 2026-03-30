import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(
        "https://word-puzzles.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      // save token
      localStorage.setItem("token", data.token);

      // save user info
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful");

      navigate("/");

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#5f8fb6] to-[#6f93b8] px-4">

      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-500 hover:text-cyan-700 rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm"
        title="Go to Home"
      >
        <FaHome size={20} />
      </button>

      <div className="bg-white/90 shadow-xl rounded-2xl w-full max-w-md p-8 relative">

        {/* Home Button */}

        <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-700 text-white font-semibold py-2 rounded-lg hover:bg-cyan-800 transition duration-300"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}

        {/* Register Link */}
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-cyan-700 cursor-pointer font-bold"
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;