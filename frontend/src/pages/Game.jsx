import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
      foundWords.length === selectedWords.length
    ) {
      setIsRunning(false);
    }
  }, [foundWords, selectedWords]);

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

      while (!placed) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * (size - word.length));

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

  const handleMouseUp = () => {
    setIsDragging(false);

    const word = selectedCells.map((c) => c.letter).join("");
    const reversed = word.split("").reverse().join("");

    let matchedWord = null;

    if (selectedWords.includes(word)) {
      matchedWord = word;
    } else if (selectedWords.includes(reversed)) {
      matchedWord = reversed;
    }

    if (matchedWord) {
      setFoundCells((prev) => [...prev, ...selectedCells]);

      setFoundWords((prev) => {
        if (prev.includes(matchedWord)) return prev;
        return [...prev, matchedWord];
      });
    }

    setSelectedCells([]);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      className="min-h-screen flex flex-col py-6 items-center justify-center px-4 bg-gradient-to-br from-[#5f8fb6] to-[#6f93b8]"
    >
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

              const isFound = foundCells.some(
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
  
                  ${isSelected ? "bg-blue-500 text-white scale-105" : ""}
                  ${isFound ? "bg-green-500 text-white" : ""}
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
              ${
                foundWords.includes(word)
                  ? "bg-green-400 line-through"
                  : "bg-white/20"
              }`}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Result */}
      {!isRunning && !isLoading && (
        <div className="mt-4 text-green-300 text-xl font-bold">
          🎉 Completed in {formatTime(time)}
        </div>
      )}

      {/* Button */}
      <button
        onClick={() => generateNewPuzzle(words)}
        className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
      >
        Next Puzzle
      </button>
    </div>
  );
}

export default Game;
