const express = require("express");
const Alert = require("../models/Alert");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error);

    res.status(500).json({
      message: "Không thể lấy alerts",
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, targetPrice, condition } = req.body;

    const alert = await Alert.create({
      userId: req.user.userId,
      type,
      targetPrice,
      condition,
      triggered: false,
    });

    res.status(201).json({
      message: "Alert saved",
      alert,
    });
  } catch (error) {
    console.error("Create alert error:", error);

    res.status(500).json({
      message: "Không thể tạo alert",
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!alert) {
      return res.status(404).json({
        message: "Không tìm thấy alert",
      });
    }

    res.json({
      message: "Đã xóa alert",
    });
  } catch (error) {
    console.error("Delete alert error:", error);

    res.status(500).json({
      message: "Không thể xóa alert",
    });
  }
});

module.exports = router;