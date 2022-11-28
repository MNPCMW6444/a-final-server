const router = require("express").Router();
const Report = require("../models/reportModel");
const Suggest = require("../models/suggestModel");

router.post("/report", async (req, res) => {
  try {
    const { Name, Content } = req.body;

    if (!Name)
      return res.status(400).json({
        errorMessage: "חסר שם",
      });

    if (!Content)
      return res.status(400).json({
        errorMessage: "חסר פירוט",
      });

    const newReport = new Report({ Name, Content });

    const savedReport = await newReport.save();

    res.json(savedReport);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/suggest", async (req, res) => {
  try {
    const { Name, Content } = req.body;

    if (!Name)
      return res.status(400).json({
        errorMessage: "חסר שם",
      });

    if (!Content)
      return res.status(400).json({
        errorMessage: "חסר פירוט",
      });

    const newSuggest = new Suggest({ Name, Content });

    const savedSuggest = await newSuggest.save();

    res.json(savedSuggest);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
