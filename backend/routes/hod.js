const express = require("express");

const router = express.Router();

const {
  saveHodSubmission,
  getMyHodSubmissions,
  submitHodSubmission,
  getFacultySubmissions,
  approveSubmission,
  rejectSubmission
} = require(
  "../controllers/hodController"
);

const {
  protect
} = require(
  "../middleware/auth"
);


// ==============================
// HOD QUESTIONNAIRE
// ==============================

// Save Draft

router.post(
  "/save",
  protect,
  saveHodSubmission
);

// View Own HOD Submissions

router.get(
  "/my",
  protect,
  getMyHodSubmissions
);

// Submit HOD Questionnaire

router.put(
  "/submit/:id",
  protect,
  submitHodSubmission
);


// ==============================
// FACULTY REVIEW
// ==============================

// View Faculty Submissions

router.get(
  "/faculty-submissions",
  protect,
  getFacultySubmissions
);

// Approve Faculty Submission

router.put(
  "/approve/:id",
  protect,
  approveSubmission
);

// Reject Faculty Submission

router.put(
  "/reject/:id",
  protect,
  rejectSubmission
);

module.exports = router;