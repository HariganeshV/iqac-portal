const express = require("express");

const router = express.Router();

const {
  saveSubmission,
  getMySubmissions,
  getSubmissionById,
  submitQuestionnaire
} = require(
  "../controllers/submissionController"
);

const {
  protect
} = require(
  "../middleware/auth"
);

// Save Draft

router.post(
  "/save",
  protect,
  saveSubmission
);

// Get My Submissions

router.get(
  "/my",
  protect,
  getMySubmissions
);

// Get Submission By ID

router.get(
  "/:id",
  protect,
  getSubmissionById
);

// Submit Questionnaire

router.put(
  "/submit/:id",
  protect,
  submitQuestionnaire
);

module.exports = router;