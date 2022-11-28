const mongoose = require("mongoose");

const mmSchema = new mongoose.Schema(
  {
    type: String,
    who: mongoose.Schema.Types.ObjectId,
    when: String,
    prof: String,
    of: String,
    image: String,
    what: String,
    how: String,
  },
  {
    timestamps: true,
  }
);

const Mm = mongoose.model("mm", mmSchema);

module.exports = Mm;
