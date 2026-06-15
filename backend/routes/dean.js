const express = require("express");

const router = express.Router();

const {
  saveDeanSubmission,
  getMyDeanSubmissions,
  submitDeanSubmission,
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
// HOD REVIEW
// ==============================

// View HOD Submissions

router.get(
  "/hod-submissions",
  protect,
  getHodSubmissions
);

// Approve HOD Submission

router.put(
  "/approve/:id",
  protect,
  approveSubmission
);

// Reject HOD Submission

router.put(
  "/reject/:id",
  protect,
  rejectSubmission
);

module.exports = router;