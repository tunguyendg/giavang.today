const express = require("express");
const PushSubscription = require("../models/PushSubscription");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({
        message: "Push subscription không hợp lệ",
      });
    }

    const subscription =
      await PushSubscription.findOneAndUpdate(
        {
          endpoint,
        },
        {
          userId: req.user.userId,
          endpoint,
          keys,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    res.status(201).json({
      message: "Push subscription saved",
      subscription,
    });
  } catch (error) {
    console.error("Save push subscription error:", error);

    res.status(500).json({
      message: "Không thể lưu push subscription",
    });
  }
});

module.exports = router;