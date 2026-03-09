import { useNavigate } from "react-router-dom";
import { FaBars, FaUser } from "react-icons/fa";
import { useState } from "react";

function Home() {
   const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const levels = [
    { name: "Easy", value: "easy" },
    { name: "Medium", value: "medium" },
    { name: "Hard", value: "hard" },
    { name: "Expert", value: "expert" },
    { name: "Numbers", value: "numbers" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5f8fb6] to-[#6f93b8] flex flex-col">
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 text-white relative">

        {/* User Icon */}
        <div className="relative">

          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full border border-white bg-white/10 flex items-center justify-center cursor-pointer"
          >
            <FaUser size={20} />
          </div>
          {open && (
            <div className="absolute left-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-10">

              <button
                onClick={() => navigate("/login")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Register
              </button>

            </div>
          )}
        </div>
        {/* Logo */}
        <h1 className="flex items-center text-lg sm:text-2xl font-bold">
          {["W", "O", "R", "D"].map((letter, i) => (
            <span
              key={i}
              className={`bg-white text-cyan-700 px-2 sm:px-2 rounded font-bold mx-[2px]
                      ${i % 2 === 0 ? "-translate-y-0" : "translate-y-2"}
                  `}
            >
              {letter}
            </span>
          ))}
          <span className="ml-2 sm:ml-2 tracking-wider">SEARCH</span>
        </h1>

        {/* Menu Icon */}
        <FaBars className="text-xl sm:text-2xl cursor-pointer" />
      </div>

      {/* Center Content */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl sm:text-3xl text-white font-semibold mb-8 sm:mb-10">
          Select Difficulty:
        </h2>

        <div className="flex flex-col gap-5 w-44 max-w-xs">
          {levels.map((level, index) => (
            <button
              key={index}
              onClick={() => navigate(`/game/${level.value}`)}
              className="w-full bg-gray-200 text-cyan-700 font-bold py-3 
                         tracking-wider rounded-lg shadow-md 
                         hover:bg-white hover:scale-105 
                         transition duration-300 text-base sm:text-lg"
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;