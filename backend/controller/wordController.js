const Word = require("../model/word");

exports.addwords = async (req, res) => {
  try {
    const words = req.body;

    const savedWords = await Word.insertMany(words);

    res.status(201).json({
      message: "Words added successfully",
      savedWords,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getwordsbylevel = async (req, res) => {
  try {
    const level = req.params.level;

    const words = await Word.find({ level: level });

    res.status(200).json({message : " Words find successfully", words});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getwords = async (req, res) => {
  try {
    const words = await Word.find();

    res.status(200).json(words);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
