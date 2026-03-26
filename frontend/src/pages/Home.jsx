import { useNavigate } from "react-router-dom";
import { FaBars, FaChevronDown, FaUser } from "react-icons/fa";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const levels = [
    { name: "Easy", value: "easy" },
    { name: "Medium", value: "medium" },
    { name: "Hard", value: "hard" },
    { name: "Expert", value: "expert" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5f8fb6] to-[#6f93b8] flex flex-col">
      {/* Navbar */}
      <div className="flex justify-between items-center sm:px-7 py-4 text-white relative">
        {/* User Section */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {user ? (
            <div className="flex items-center gap-1 cursor-pointer group">
              <div className="w-8 h-8 bg-white text-cyan-700 rounded-full flex items-center justify-center font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Hide name on small screen */}
              <span className="hidden sm:block font-semibold">{user.name}</span>

              <FaChevronDown
                size={12}
                className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-white text-cyan-700 rounded-full flex items-center justify-center">
                <FaUser />
              </div>
            </div>
          )}

          {/* Dropdown */}
          {open && (
            <div className="absolute left-0 w-40 bg-white text-black rounded-xl shadow-xl overflow-hidden">
              {!user && (
                <>
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
                </>
              )}

              {user && (
                <>
                  <button
                    onClick={() => navigate("/gamestatus")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Game Stats
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Logo */}
        <h1 className="flex items-center text-lg sm:text-2xl font-bold">
          {["W", "O", "R", "D"].map((letter, i) => (
            <span
              key={i}
              className={`bg-white text-cyan-700 px-2 rounded font-bold mx-[2px]
              ${i % 2 === 0 ? "-translate-y-0" : "translate-y-2"}`}
            >
              {letter}
            </span>
          ))}

          {/* Hide SEARCH on very small screens */}
          <span className="ml-2 tracking-wider sm:block">SEARCH</span>
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
