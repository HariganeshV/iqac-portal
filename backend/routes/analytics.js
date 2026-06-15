const express = require("express");

const router = express.Router();

const {
  getOverallAnalytics
} = require(
  "../controllers/analyticsController"
);

const {
  protect
} = require(
  "../middleware/auth"
);

const authorize =
  require(
    "../middleware/authorize"
  );

router.get(
  "/overall",
  protect,
  authorize(
    "admin",
    "dean"
  ),
  getOverallAnalytics
);

module.exports = router;