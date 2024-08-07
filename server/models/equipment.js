const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  images: {
    type: [String],
  },
  name: {
    type: String,
    required: true,
    unique: [true, "Equipment name must be unique"],
  },
  description: {
    type: String,
  },
  targetedMuscles: {
    type: [String],
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0,
  },
});

module.exports = mongoose.model("Equipment", equipmentSchema);
