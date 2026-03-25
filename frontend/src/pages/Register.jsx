import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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
        "https://word-puzzles.onrender.com/register",
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
      setMessage(data.message || "Registration failed");
      return;
    }
    localStorage.setItem("token", data.token);

// optional
localStorage.setItem(
  "user",
  JSON.stringify({ name: formData.name })
);

    setMessage(data.message);

    navigate("/");

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#5f8fb6] to-[#6f93b8] px-4">

      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-700 text-white font-semibold py-2 rounded-lg hover:bg-cyan-800 transition duration-300"
          >
            Register
          </button>

        </form>

        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}

        <p className="text-center text-sm mt-4">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-700 cursor-pointer font-bold"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;