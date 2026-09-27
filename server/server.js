const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");
const alertRoutes = require("./routes/alerts");
const pushRoutes = require("./routes/push");
const goldRoutes = require("./routes/gold");

const PushSubscription = require(
  "./models/PushSubscription"
);

const authMiddleware = require(
  "./middleware/auth"
);

const app = express();

/* =========================
   DATABASE
========================= */

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

/* =========================
   WEB PUSH
========================= */

webpush.setVapidDetails(
  "mailto:dev@giavang.today",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/* =========================
   CORS
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
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
        new Error(
          "Origin not allowed by CORS"
        )
      );
    },
  })
);

/* =========================
   BODY PARSER
========================= */

app.use(express.json());

/* =========================
   RATE LIMIT
========================= */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Bạn gửi quá nhiều request. Vui lòng thử lại sau.",
  },
});

app.use("/api", apiLimiter);

/* =========================
   API ROUTES
========================= */

app.use("/api/gold", goldRoutes);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/portfolio",
  portfolioRoutes
);

app.use(
  "/api/alerts",
  alertRoutes
);

app.use(
  "/api/push",
  pushRoutes
);

/* =========================
   ROOT
========================= */

app.get("/", (req, res) => {
  res.json({
    message:
      "giavang.today API is running",
  });
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service:
      "giavang.today API",
    uptime:
      process.uptime(),
    timestamp:
      new Date().toISOString(),
  });
});

/* =========================
   DEV PUSH TEST
========================= */

if (
  process.env.NODE_ENV !==
  "production"
) {
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
            await webpush
              .sendNotification(
                {
                  endpoint:
                    subscription.endpoint,

                  keys: {
                    p256dh:
                      subscription
                        .keys
                        .p256dh,

                    auth:
                      subscription
                        .keys
                        .auth,
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
              error.statusCode ===
                404 ||
              error.statusCode ===
                410
            ) {
              await PushSubscription
                .deleteOne({
                  _id:
                    subscription._id,
                });
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
          message:
            "Push sent",
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
            message:
              "Push failed",
          });
      }
    }
  );
}

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    message:
      "Không tìm thấy API endpoint",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Unhandled error:",
      error
    );

    res
      .status(500)
      .json({
        message:
          process.env.NODE_ENV ===
          "production"
            ? "Đã xảy ra lỗi hệ thống"
            : error.message,
      });
  }
);

/* =========================
   START SERVER
========================= */

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});