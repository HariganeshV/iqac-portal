const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  getAllSubmissions,
  getSubmissionById
} = require(
  "../controllers/adminController"
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


// Dashboard

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);


// Users

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);


// Submissions

router.get(
  "/submissions",
  protect,
  authorize("admin"),
  getAllSubmissions
);

router.get(
  "/submissions/:id",
  protect,
  authorize("admin"),
  getSubmissionById
);

module.exports = router;