import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaHome, FaBars } from "react-icons/fa";
import { MdReplay } from "react-icons/md";
import { BsClockFill } from "react-icons/bs";

function Game() {
  const { level } = useParams();

  const [words, setWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [grid, setGrid] = useState([]);

  const [selectedCells, setSelectedCells] = useState([]);
  const [foundCells, setFoundCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  const [isDragging, setIsDragging] = useState(false);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(2);
  const navigate = useNavigate();

  const colors = [
    "bg-green-500/40",
    "bg-yellow-500/40",
    "bg-pink-500/40",
    "bg-blue-500/40",
    "bg-purple-500/40",
    "bg-orange-500/40"
  ];

  // 🔥 Format Time
  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // 🔹 Timer
  useEffect(() => {
    let interval;

    if (isRunning && !isLoading) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isLoading]);

  // 🔹 Stop timer
  useEffect(() => {
    if (
      selectedWords.length > 0 &&
      foundWords.length === selectedWords.length &&
      isRunning // Only trigger if it was previously running to avoid multiple calls
    ) {
      setIsRunning(false);
      setShowModal(true);

      // Save game stats to backend
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.name) {
        fetch("http://localhost:5002/gamestatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: user.name,
            difficulty: level,
            time: time,
          }),
        }).catch((err) => console.error("Failed to save game stats:", err));
      }
    }
  }, [foundWords, selectedWords, isRunning, level, time]);

  // 🔹 Fetch words
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://word-puzzles.onrender.com/getword/${level}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const wordsArray = data.words.map((item) => item.word.toUpperCase());
        setWords(wordsArray);
        generateNewPuzzle(wordsArray);
      });
  }, [level]);

  // 🔹 Generate puzzle
  const generateNewPuzzle = (allWords) => {
    if (!allWords || allWords.length === 0) return;

    setIsLoading(true);

    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    const randomSeven = shuffled.slice(0, 7);

    const newGrid = generateGrid(randomSeven);

    setSelectedWords(randomSeven);
    setGrid(newGrid);

    setSelectedCells([]);
    setFoundCells([]);
    setFoundWords([]);
    setTime(0);
    setHintsRemaining(2);

    setIsLoading(false);
    setIsRunning(true);
  };

  // 🔹 Create grid
  const createGrid = (size) =>
    Array.from({ length: size }, () => Array(size).fill(""));

  // 🔹 Place words (horizontal only)
  const placeWords = (grid, words) => {
    const size = grid.length;

    words.forEach((word) => {
      // 🔥 safety check
      if (word.length > size) {
        console.log("Word too big:", word);
        return;
      }

      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 200) {
        attempts++;
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * (size - word.length + 1));

        let canPlace = true;

        for (let i = 0; i < word.length; i++) {
          if (grid[row][col + i] !== "") {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
          }
          placed = true;
        }
      }

      if (!placed) {
        console.warn(`Could not place word: ${word}`);
      }
    });

    return grid;
  };

  // 🔹 Fill random letters
  const fillRandomLetters = (grid) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return grid.map((row) =>
      row.map((cell) =>
        cell === ""
          ? alphabet[Math.floor(Math.random() * alphabet.length)]
          : cell,
      ),
    );
  };

  // 🔥 Dynamic Grid Fix (IMPORTANT)
  const generateGrid = (words) => {
    const longestWord = Math.max(...words.map((w) => w.length));

    const size = Math.max(10, longestWord + 2); // 🔥 dynamic

    let grid = createGrid(size);
    grid = placeWords(grid, words);
    grid = fillRandomLetters(grid);

    return grid;
  };

  // 🔥 Drag logic
  const handleMouseDown = (row, col, letter) => {
    setIsDragging(true);
    setSelectedCells([{ row, col, letter }]);
  };

  const handleMouseEnter = (row, col, letter) => {
    if (!isDragging) return;

    setSelectedCells((prev) => {
      const exists = prev.some((c) => c.row === row && c.col === col);
      if (exists) return prev;
      return [...prev, { row, col, letter }];
    });
  };

  const handleHint = () => {
    setIsMenuOpen(false);

    if (hintsRemaining <= 0) return;

    const remainingWords = selectedWords.filter((w) => !foundWords.includes(w));
    if (remainingWords.length === 0) return;

    const wordToHint = remainingWords[0];
    const reversedWord = wordToHint.split("").reverse().join("");
    let matchCells = null;

    // Find wordToHint or reversedWord in the grid
    for (let r = 0; r < grid.length; r++) {
      const rowStr = grid[r].join("");
      let idx = rowStr.indexOf(wordToHint);
      let isReversed = false;

      if (idx === -1) {
        idx = rowStr.indexOf(reversedWord);
        isReversed = true;
      }

      if (idx !== -1) {
        matchCells = [];
        for (let i = 0; i < wordToHint.length; i++) {
          matchCells.push({
            row: r,
            col: idx + i,
            letter: isReversed ? reversedWord[i] : wordToHint[i],
          });
        }
        break;
      }
    }

    if (matchCells) {
      const color = colors[foundWords.length % colors.length];
      const coloredCells = matchCells.map((cell) => ({
        ...cell,
        color,
      }));
      setFoundCells((prev) => [...prev, ...coloredCells]);
      setFoundWords((prev) => [...prev, wordToHint]);
      setHintsRemaining((prev) => prev - 1);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    const word = selectedCells.map(c => c.letter).join("");
    const reversed = word.split("").reverse().join("");

    let matchedWord = null;

    if (selectedWords.includes(word)) matchedWord = word;
    else if (selectedWords.includes(reversed)) matchedWord = reversed;

    if (matchedWord) {

      // 🔥 color assign
      const color = colors[foundWords.length % colors.length];

      const coloredCells = selectedCells.map(cell => ({
        ...cell,
        color
      }));

      setFoundCells(prev => [...prev, ...coloredCells]);

      setFoundWords(prev => {
        if (prev.includes(matchedWord)) return prev;
        return [...prev, matchedWord];
      });
    }

    setSelectedCells([]);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      className="relative min-h-screen flex flex-col py-6 items-center justify-center px-4 bg-gradient-to-br from-[#5f8fb6] to-[#6f93b8]"
    >
      {/* Hamburger Menu */}
      <div
        className="absolute top-4 right-4 z-40"
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          onMouseEnter={() => setIsMenuOpen(true)}
          className="text-white text-2xl p-2 rounded-md transition "
        >
          <FaBars />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 bg-white rounded-lg shadow-xl overflow-hidden min-w-[150px]">
            <button
              onClick={() => { setIsMenuOpen(false); generateNewPuzzle(words); }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 font-semibold border-b transition"
            >
              New Game
            </button>
            <button
              onClick={handleHint}
              disabled={hintsRemaining <= 0}
              className={`block w-full text-left px-4 py-3 font-semibold border-b transition ${
                hintsRemaining > 0 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-gray-400 cursor-not-allowed bg-gray-50 bg-opacity-50"
              }`}
            >
              Hint ({hintsRemaining})
            </button>
            <button
              onClick={() => { setIsMenuOpen(false); setShowGiveUpModal(true); }}
              className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-semibold transition"
            >
              Give Up
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-white text-3xl font-bold mb-2 uppercase tracking-wide">
        {level} Level
      </h1>

      {/* Timer */}
      <div className="text-white text-xl font-semibold mb-4 bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
        ⏱ {formatTime(time)}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-white text-lg font-semibold mt-6">
          Loading Puzzle...
        </div>
      ) : (
        <div
          className="grid gap-[2px] sm:gap-1 bg-white/90 p-2 sm:p-3 rounded-sm shadow-xl"
          style={{
            gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => {
              const isSelected = selectedCells.some(
                (c) => c.row === rowIndex && c.col === colIndex,
              );

              const foundCell = foundCells.find(
                (c) => c.row === rowIndex && c.col === colIndex,
              );

              return (
                <div
                  key={rowIndex + "-" + colIndex}
                  onMouseDown={() =>
                    handleMouseDown(rowIndex, colIndex, letter)
                  }
                  onMouseEnter={() =>
                    handleMouseEnter(rowIndex, colIndex, letter)
                  }
                  className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 !text-[14px] sm:text-sm md:text-base flex items-center justify-center font-bold border rounded-md cursor-pointer transition-all
  
                 ${isSelected ? "bg-blue-300/40" : ""}
                  ${foundCell ? foundCell.color : ""}
                  hover:bg-blue-200
                  `}
                >
                  {letter}
                </div>
              );
            }),
          )}
        </div>
      )}

      {/* Words */}
      <div className="flex flex-wrap gap-2 mt-5 justify-center max-w-md text-white">
        {selectedWords.map((word, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-semibold
              ${foundWords.includes(word)
                ? "bg-green-400 line-through"
                : "bg-white/20"
              }`}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Give Up Modal */}
      {showGiveUpModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-100 rounded-2xl p-6 w-[320px] text-center shadow-2xl animate-scaleIn relative overflow-hidden">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Are you sure you want to give up?
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGiveUpModal(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold transition"
              >
                No
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 py-2 rounded-lg font-semibold transition shadow"
              >
                Sure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {showModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-slate-100 rounded-2xl p-6 w-[320px] text-center shadow-2xl animate-scaleIn relative overflow-hidden">

            {/* Top Gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

            {/* Trophy Icon */}
            <div className="flex justify-center mb-3 text-yellow-500 text-4xl">
              <FaTrophy />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              You Win!
            </h2>

            <p className="text-gray-500 text-sm mb-4">
              Amazing performance 🚀
            </p>

            {/* Time Box */}
            <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-xl py-3 mb-5">
              <BsClockFill className="text-blue-500 text-lg" />
              <span className="text-2xl font-bold text-blue-600">
                {formatTime(time)}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">

              {/* Home */}
              <button
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold transition"
              >
                <FaHome />
                Home
              </button>

              {/* Next */}
              <button
                onClick={() => {
                  setShowModal(false);
                  generateNewPuzzle(words);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-lg font-semibold transition shadow"
              >
                <MdReplay />
                Next
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default Game;
