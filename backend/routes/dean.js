const express = require("express");

const router = express.Router();

const {
  saveDeanSubmission,
  getMyDeanSubmissions,
  submitDeanSubmission,

  getFacultySubmissions,
  getHodSubmissions,

  approveSubmission,
  rejectSubmission
} = require(
  "../controllers/deanController"
);

const {
  protect
} = require(
  "../middleware/auth"
);

// ==============================
// DEAN QUESTIONNAIRE
// ==============================

// Save Draft

router.post(
  "/save",
  protect,
  saveDeanSubmission
);

// View Own Dean Submissions

router.get(
  "/my",
  protect,
  getMyDeanSubmissions
);

// Submit Dean Questionnaire

router.put(
  "/submit/:id",
  protect,
  submitDeanSubmission
);

// ==============================
// FACULTY REVIEW
// ==============================

router.get(
  "/faculty-submissions",
  protect,
  getFacultySubmissions
);

// ==============================
// HOD REVIEW
// ==============================

router.get(
  "/hod-submissions",
  protect,
  getHodSubmissions
);

// Approve Submission

router.put(
  "/approve/:id",
  protect,
  approveSubmission
);

// Reject Submission

router.put(
  "/reject/:id",
  protect,
  rejectSubmission
);

module.exports = router;