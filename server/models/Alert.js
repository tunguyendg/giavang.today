const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
    },

    targetPrice: {
      type: Number,
      required: true,
    },

    condition: {
      type: String,
      enum: ["below", "above"],
      required: true,
    },

    triggered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;