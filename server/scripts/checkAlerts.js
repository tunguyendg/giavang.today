require("dotenv").config();

const mongoose = require("mongoose");
const webpush = require("web-push");

const Alert = require("../models/Alert");
const PushSubscription = require(
  "../models/PushSubscription"
);
const goldProvider = require(
  "../services/goldProvider"
);

webpush.setVapidDetails(
  "mailto:dev@giavang.today",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function checkAlerts() {
  const alerts = await Alert.find({
    triggered: false,
  });

  console.log(
    `[${new Date().toISOString()}] Checking ${alerts.length} alert(s)`
  );

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
          ? currentPrice <= alert.targetPrice
          : currentPrice >= alert.targetPrice;

      console.log({
        alertId: alert._id,
        type: alert.type,
        currentPrice,
        targetPrice: alert.targetPrice,
        condition: alert.condition,
        isTriggered,
      });

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
          "Không có Push Subscription:",
          alert.userId
        );

        continue;
      }

      const payload = JSON.stringify({
        title: "🔔 giavang.today",
        body: `${priceData.name} hiện là ${currentPrice.toLocaleString(
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
              "Removed expired subscription:",
              subscription._id
            );
          }
        }
      }

      if (!sentSuccessfully) {
        console.log(
          "Không gửi được push. Alert vẫn chưa trigger:",
          alert._id
        );

        continue;
      }

      alert.triggered = true;
      await alert.save();

      console.log(
        "Alert triggered:",
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

async function main() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      "MongoDB connected for alert job"
    );

    await checkAlerts();
  } catch (error) {
    console.error(
      "Alert job failed:",
      error
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log(
      "Alert job finished"
    );
  }
}

main();