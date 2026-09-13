const mongoose = require("mongoose");
const cron = require("node-cron");
const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");
const alertRoutes = require("./routes/alerts");
const pushRoutes = require("./routes/push");

const Alert = require("./models/Alert");
const PushSubscription = require("./models/PushSubscription");

const authMiddleware = require("./middleware/auth");
const goldRoutes = require("./routes/gold");
const goldProvider = require("./services/goldProvider");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });

webpush.setVapidDetails(
  "mailto:dev@giavang.today",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://giavang.today",
  "https://www.giavang.today",
];

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("Origin not allowed by CORS")
      );
    },
  })
);
app.use(express.json());

app.use("/api/gold", goldRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/push", pushRoutes);

async function checkAlert() {
  const alerts = await Alert.find({
    triggered: false,
  });

  if (alerts.length === 0) {
    console.log(
      "Không có alert để kiểm tra"
    );
    return;
  }

  for (const alert of alerts) {
    try {
      const priceData =
        await goldProvider.getPrice(
          alert.type
        );

      const currentPrice =
        Number(priceData.sell);

      const isTriggered =
        alert.condition === "below"
          ? currentPrice <=
          alert.targetPrice
          : currentPrice >=
          alert.targetPrice;

      console.log(
        "Checking alert:",
        {
          type: alert.type,
          currentPrice,
          targetPrice:
            alert.targetPrice,
          condition:
            alert.condition,
          isTriggered,
        }
      );

      if (!isTriggered) {
        continue;
      }

      const subscriptions =
        await PushSubscription.find({
          userId: alert.userId,
        });

      if (
        subscriptions.length === 0
      ) {
        console.log(
          "User không có Push Subscription:",
          alert.userId
        );

        continue;
      }

      const payload =
        JSON.stringify({
          title:
            "🔔 giavang.today",
          body: `${priceData.name
            } hiện là ${currentPrice.toLocaleString(
              "vi-VN"
            )}đ/lượng`,
        });

      let sentSuccessfully = false;

      for (
        const subscription of
        subscriptions
      ) {
        try {
          await webpush.sendNotification(
            {
              endpoint:
                subscription.endpoint,
              keys: {
                p256dh:
                  subscription.keys
                    .p256dh,
                auth:
                  subscription.keys.auth,
              },
            },
            payload
          );

          sentSuccessfully = true;

          console.log(
            "Push sent:",
            subscription._id
          );
        } catch (error) {
          console.error(
            "Push send error:",
            subscription._id,
            error
          );

          // Subscription đã hết hạn / không còn hợp lệ
          if (
            error.statusCode === 404 ||
            error.statusCode === 410
          ) {
            await PushSubscription.deleteOne(
              {
                _id:
                  subscription._id,
              }
            );

            console.log(
              "Removed expired push subscription:",
              subscription._id
            );
          }
        }
      }

      if (!sentSuccessfully) {
        console.log(
          "Không gửi được push nào. Alert giữ trạng thái chưa trigger:",
          alert._id
        );

        continue;
      }

      alert.triggered = true;

      await alert.save();

      console.log(
        "Alert triggered successfully:",
        alert._id
      );
    } catch (error) {
      console.error(
        "Alert check error:",
        alert._id,
        error
      );
    }
  }
}

cron.schedule(
  "*/5 * * * *",
  async () => {
    console.log(
      "Running alert check..."
    );

    try {
      await checkAlert();
    } catch (error) {
      console.error(
        "Scheduled alert check error:",
        error
      );
    }
  }
);

app.get("/", (req, res) => {
  res.json({
    message:
      "giavang.today API is running",
  });
});

app.post(
  "/api/push/test",
  authMiddleware,
  async (req, res) => {
    try {
      const subscriptions =
        await PushSubscription.find({
          userId:
            req.user.userId,
        });

      if (
        subscriptions.length === 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Tài khoản này chưa có Push Subscription",
          });
      }

      const payload =
        JSON.stringify({
          title:
            "🔔 giavang.today",
          body:
            "Test Web Push thành công!",
        });

      let sentCount = 0;

      for (
        const subscription of
        subscriptions
      ) {
        try {
          await webpush.sendNotification(
            {
              endpoint:
                subscription.endpoint,
              keys: {
                p256dh:
                  subscription.keys
                    .p256dh,
                auth:
                  subscription.keys.auth,
              },
            },
            payload
          );

          sentCount++;
        } catch (error) {
          console.error(
            "Test push error:",
            subscription._id,
            error
          );

          if (
            error.statusCode === 404 ||
            error.statusCode === 410
          ) {
            await PushSubscription.deleteOne(
              {
                _id:
                  subscription._id,
              }
            );
          }
        }
      }

      if (sentCount === 0) {
        return res
          .status(500)
          .json({
            message:
              "Không thể gửi Push Notification",
          });
      }

      console.log(
        "Test push sent to user:",
        req.user.userId,
        "devices:",
        sentCount
      );

      res.json({
        message: "Push sent",
        sentCount,
      });
    } catch (error) {
      console.error(
        "Push test error:",
        error
      );

      res
        .status(500)
        .json({
          message: "Push failed",
        });
    }
  }
);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});