const express = require("express");
const router = express.Router();

const goldProvider = require("../services/goldProvider");
const {
  getUsdVndRate,
} = require("../services/fxProvider");

const {
  convertWorldGoldToVndPerLuong,
  calculatePremium,
} = require("../services/goldConverter");

router.get("/world-conversion", async (req, res, next) => {
  try {
    const worldGold =
      await goldProvider.getPrice("XAUUSD");

    const sjc =
      await goldProvider.getPrice("SJL1L10");
    const fx = await getUsdVndRate();

    const xauUsd = Number(worldGold.buy || 0);
    const usdVnd = Number(fx.sell || 0);
    const sjcSell = Number(sjc.sell || 0);

    const worldVndPerLuong =
      convertWorldGoldToVndPerLuong(
        xauUsd,
        usdVnd
      );

    const premiumData =
      calculatePremium(
        sjcSell,
        worldVndPerLuong
      );

    return res.status(200).json({
      success: true,
      data: {
        xauUsd,
        usdVnd,
        worldVndPerLuong,
        sjcSell,
        premium: premiumData.premium,
        premiumPercent:
          premiumData.premiumPercent,
        fxSource: fx.source,
      },
    });
  } catch (error) {
    next(error);
  }
});

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