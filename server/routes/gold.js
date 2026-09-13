const express = require("express");
const router = express.Router();

const goldProvider = require("../services/goldProvider");

router.get("/", async (req, res) => {
  try {
    const data = await goldProvider.getAllPrices();
    res.json(data);
  } catch (error) {
    console.error("Get all gold prices error:", error.message);

    res.status(500).json({
      message: "Không lấy được bảng giá vàng",
    });
  }
});

router.get("/:type", async (req, res) => {
  try {
    const data = await goldProvider.getPrice(req.params.type);
    res.json(data);
  } catch (error) {
    console.error("Get gold price error:", error.message);

    res.status(500).json({
      message: "Không lấy được giá vàng",
    });
  }
});

router.get("/:type/history", async (req, res) => {
  try {
    const days = req.query.days || 7;

    const data = await goldProvider.getHistory(
      req.params.type,
      days
    );

    res.json(data);
  } catch (error) {
    console.error("Get gold history error:", error.message);

    res.status(500).json({
      message: "Không lấy được lịch sử giá vàng",
    });
  }
});

module.exports = router;