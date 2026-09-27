const express = require("express");
const {
  getUsdVndRate,
} = require("../services/fxProvider");

const router = express.Router();

router.get("/usd-vnd", async (req, res, next) => {
  try {
    const rate = await getUsdVndRate();

    return res.status(200).json({
      success: true,
      data: rate,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;