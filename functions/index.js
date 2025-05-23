/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const express = require("express");
const { ngExpressEngine } = require("@nguniversal/express-engine");
const { AppServerModule } = require("./dist/amybrows/server/main");
const app = express();

app.engine("html", ngExpressEngine({ bootstrap: AppServerModule }));
app.set("view engine", "html");
app.set("views", "dist/amybrows/browser");

app.get("*", (req, res) => {
  res.render("index", { req });
});

exports.ssr = functions.https.onRequest(app);
