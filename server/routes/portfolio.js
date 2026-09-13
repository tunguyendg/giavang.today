const express = require("express");
const Portfolio = require("../models/Portfolio");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Portfolio.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      items,
    });
  } catch (error) {
    console.error("Get portfolio error:", error);

    res.status(500).json({
      message: "Không thể lấy portfolio",
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, qty, cost } = req.body;

    const item = await Portfolio.create({
      userId: req.user.userId,
      type,
      qty,
      cost,
    });

    res.status(201).json({
      message: "Đã thêm vàng vào portfolio",
      item,
    });
  } catch (error) {
    console.error("Create portfolio error:", error);

    res.status(500).json({
      message: "Không thể thêm portfolio",
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy portfolio item",
      });
    }

    res.json({
      message: "Đã xóa portfolio item",
    });
  } catch (error) {
    console.error("Delete portfolio error:", error);

    res.status(500).json({
      message: "Không thể xóa portfolio item",
    });
  }
});

module.exports = router;