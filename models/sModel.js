const mongoose = require("mongoose");

const sSchema = new mongoose.Schema({
  stringified: String,
});

const S = mongoose.model("s", sSchema);

module.exports = S;
