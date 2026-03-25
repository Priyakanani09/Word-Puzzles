import React, { useState, useEffect } from "react";
import { FaTimes, FaTrophy, FaGamepad, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function GameStatus() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Easy");
  const [loading, setLoading] = useState(false);

  // Data from backend
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const tabs = ["Easy", "Medium", "Hard", "Expert"];

  useEffect(() => {
    fetchDataForDifficulty(activeTab);
  }, [activeTab]);

  const fetchDataForDifficulty = async (difficulty) => {
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userNameQuery = user && user.name ? `?userName=${encodeURIComponent(user.name)}` : "";
      
      const response = await fetch(`https://word-puzzles.onrender.com/gamestatus/${difficulty.toLowerCase()}${userNameQuery}`);
      if (response.ok) {
        const data = await response.json();
        setTotalGamesPlayed(data.totalGamesPlayed || 0);
        setBestTime(data.bestTime);
        setLeaderboard(data.leaderboard || []);
      } else {
        console.error("Failed to fetch game stats");
      }
    } catch (error) {
      console.error("Error fetching game stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (timeInSeconds === null || timeInSeconds === undefined) return "--:--";
    const min = Math.floor(timeInSeconds / 60);
    const sec = timeInSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-b from-[#5f8fb6] to-[#6f93b8] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>
      
      <div 
        className="relative z-50 w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <FaTrophy className="text-yellow-500" />
            Game Status
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-2 pt-2 bg-gray-50 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-center font-semibold transition whitespace-nowrap border-b-2 
                ${activeTab === tab 
                  ? "border-blue-500 text-blue-600 bg-white rounded-t-lg" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[250px]">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Overall Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-5 flex flex-col items-center justify-center border border-blue-100 shadow-sm">
                  <FaGamepad className="text-3xl text-blue-500 mb-2" />
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Games Played</span>
                  <span className="text-3xl font-bold text-gray-800 mt-1">{totalGamesPlayed}</span>
                </div>
                <div className="bg-green-50 rounded-xl p-5 flex flex-col items-center justify-center border border-green-100 shadow-sm">
                  <FaClock className="text-3xl text-green-500 mb-2" />
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Best Time</span>
                  <span className="text-3xl font-bold text-gray-800 mt-1">{formatTime(bestTime)}</span>
                </div>
              </div>

              {/* Leaderboard */}
              <section className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-700">Top 5 Leaderboard</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 py-1 px-2 rounded-full font-bold">Best Times</span>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {leaderboard.length > 0 ? leaderboard.map((player, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm shadow-sm
                          ${index === 0 ? "bg-yellow-400 text-white" : 
                            index === 1 ? "bg-gray-300 text-gray-700" : 
                            index === 2 ? "bg-amber-600 text-white" : 
                            "bg-gray-100 text-gray-600"}`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-semibold text-gray-700">{player.user}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 font-mono text-[15px] bg-gray-100 px-3 py-1 rounded shadow-inner">
                        ⏱ {formatTime(player.bestTime)}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center p-8 text-gray-400 font-medium">No leaderboard info available for this difficulty yet. Be the first!</div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default GameStatus;