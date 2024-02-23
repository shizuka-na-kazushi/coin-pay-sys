/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError, onRequest } from "firebase-functions/v2/https";
import { DatabaseEvent, onValueUpdated } from "firebase-functions/v2/database";
import * as logger from "firebase-functions/logger";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { app } from "./fb";
app;

import RtDb from "./rtdb";
import CoinTask from "./cointask";
import { cfg } from "./inc";
import { DataSnapshot } from "firebase-admin/database";
import { Change } from "firebase-functions/v1";
import { Switchbot } from "./switchbot";

// init stripe instance.
/* eslint-disable-next-line */
const stripe = require("stripe")(process.env.COIN_PAY_SYS_STRIPE_KEY);

const calculateOrderAmount = (items: any) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  items;
  return 500;
};

// ************************************************************************
//
// hueOAuthFirstUrl
//
// ************************************************************************
export const createPaymentIntent = onRequest(
  { cors: [/firebaseapp\.com$/, /web\.app$/] },
  async (request, response) => {
    try {
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(null),
        currency: "jpy",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });

      if (!paymentIntent || !paymentIntent.client_secret) {
        logger.error(JSON.stringify(paymentIntent));
        throw new HttpsError("unavailable", "Stripe sdk returns invalid paymentIntent.");
      }

      logger.info("paymentIntent.client_secret = " + paymentIntent.client_secret);
      response.json({
        data: { clientSecret: paymentIntent.client_secret },
      });
    } catch (e: any) {
      response.status(505).send(e.message);
    }
  }
);

export const onPaymentCompleted = onRequest(
  { cors: [/firebaseapp\.com$/, /web\.app$/] },
  async (request, response) => {
    /* eslint-disable-next-line */
    const dummy_coin_box_id = "coinbox-1";
    /* eslint-disable-next-line */
    const dummy_timer_in_seconds = 90;

    console.log(request.is("json"));
    console.log(JSON.stringify(request.body, null, " "));
    if (!request.body.data || !request.body.data.payment_intent) {
      throw new HttpsError("invalid-argument", "valid secret required");
    }

    try {
      const list = await stripe.paymentIntents.retrieve(request.body.data.payment_intent);
      console.log("list.status = " + list.status);
      if (list && list.status && list.status == "succeeded") {
        console.log("payment was properly done!");

        // create db entry to identify payment.
        const rtdb = new RtDb();
        const result = await rtdb.startProcess(dummy_coin_box_id, request.body.data.payment_intent, dummy_timer_in_seconds);

        if (result) {
          // create cloud task for timer
          console.log("going to create timer task...");
          const task = new CoinTask(cfg.taskHandlerUrl);
          await task.startTimer(dummy_coin_box_id, dummy_timer_in_seconds);
          console.log("...done.");
          response.json({ data: { status: "ok" } });
        } else {
          response.json({ data: { status: "error: already-started" } });
        }
      } else {
        response.json({ data: { status: "error: invalid payment" } });
      }
    } catch (e: any) {
      response.status(500).send(e.message);
    }
  }
);

export const onCoinboxTaskFinished = onRequest(
  async (request, response) => {
    console.log("onCoinboxTaskFinished");

    try {
      if (request.body && request.body.coinBoxId) {
        const rtdb = new RtDb();
        await rtdb.endProcess(request.body.coinBoxId);
        response.sendStatus(200);
      } else {
        response.sendStatus(400).send("invalid arguments");
      }
    } catch (e: any) {
      response.sendStatus(500).send(e.message);
    }
  }
);

export const onCoinboxStateUpdated = onValueUpdated("coinbox/coinbox-1", 
  (event: DatabaseEvent<Change<DataSnapshot>, object>) => {
    console.log("onCoinboxStateUpdated: " + JSON.stringify(event.data.after.val()));

    const d = event.data.after.val();
    Switchbot.changePlugState(d && d.status && d.status == "on");
});
