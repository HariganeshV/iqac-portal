const express = require("express");

const router = express.Router();

const {
  saveSubmission,
  getMySubmissions,
  getSubmissionById
} = require(
  "../controllers/submissionController"
);

const {
  protect
} = require(
  "../middleware/auth"
);

router.post(
  "/save",
  protect,
  saveSubmission
);

router.get(
  "/my",
  protect,
  getMySubmissions
);

router.get(
  "/:id",
  protect,
  getSubmissionById
);

module.exports = router;