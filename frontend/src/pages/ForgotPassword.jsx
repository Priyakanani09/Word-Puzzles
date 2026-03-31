import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

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
        "https://word-puzzles.onrender.com/forgot-password",
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
        // Validation messages can sometimes be arrays in this app
        if (Array.isArray(data.message)) {
          setMessage(data.message.join(", "));
        } else {
          setMessage(data.message || "Failed to reset password.");
        }
        setSuccess(false);
        return;
      }

      setMessage(data.message || "Password reset successful.");
      setSuccess(true);
      
      // Auto redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      setMessage("Server error. Please ensure the backend server is running.");
      setSuccess(false);
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

      <div className="bg-white/90 shadow-xl rounded-2xl w-[90%] sm:w-full max-w-md p-6 sm:p-8 relative">
        <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="Enter New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-700 text-white font-semibold py-2 rounded-lg hover:bg-cyan-800 transition duration-300"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 text-sm text-center rounded-lg ${success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        {/* Back to Login Link */}
        <p className="text-center text-sm mt-4">
          Remembered your password?{" "}
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

export default ForgotPassword;