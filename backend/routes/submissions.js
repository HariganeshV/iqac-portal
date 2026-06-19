const express = require("express");

const router = express.Router();

const {
  saveSubmission,
  getMySubmissions,
  getSubmissionById,
  submitQuestionnaire,
  updateSubmission,
  downloadPDF
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

// PDF Download Route

router.get(
  "/download/:id",
  protect,
  downloadPDF
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

router.put(
  "/update/:id",
  protect,
  updateSubmission
);

module.exports = router;