const GameStatus = require('../model/gamestatus');

exports.saveGameResult = async (req, res) => {
  try {
    const { userName, difficulty, time } = req.body;
    
    if (!userName || !difficulty || time === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newResult = new GameStatus({
      userName,
      difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase(),
      time
    });

    await newResult.save();
    res.status(201).json({ message: "Game result saved successfully", data: newResult });
  } catch (error) {
    console.error("Error saving game result:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getGameStats = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const { userName } = req.query;
    const normalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

    // Stats criteria (User Specific)
    const statsQuery = { difficulty: normalizedDifficulty };
    if (userName) {
      statsQuery.userName = userName;
    }

    // 1. Total games played (User specific)
    const totalGamesPlayed = await GameStatus.countDocuments(statsQuery);

    // 2. Best time overall (User specific)
    const bestTimeRecord = await GameStatus.findOne(statsQuery).sort({ time: 1 });
    const bestTime = bestTimeRecord ? bestTimeRecord.time : null;

    // 3. Top 5 leaderboard (Global - filtering by difficulty only)
    const leaderboard = await GameStatus.aggregate([
      { $match: { difficulty: normalizedDifficulty } },
      { $group: { _id: "$userName", bestTime: { $min: "$time" } } },
      { $sort: { bestTime: 1 } },
      { $limit: 5 },
      { $project: { _id: 0, user: "$_id", bestTime: 1 } }
    ]);

    res.status(200).json({
      difficulty: normalizedDifficulty,
      totalGamesPlayed,
      bestTime,
      leaderboard
    });
  } catch (error) {
    console.error("Error fetching game stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
