const User = require("../models/User");
const Submission = require("../models/Submission");

// ==============================
// ADMIN DASHBOARD STATS
// ==============================

exports.getDashboardStats =
  async (req, res) => {
    try {

      const totalUsers =
        await User.countDocuments();

      const totalFaculty =
        await User.countDocuments({
          role: "faculty"
        });

      const totalHod =
        await User.countDocuments({
          role: "hod"
        });

      const totalDean =
        await User.countDocuments({
          role: "dean"
        });

      const totalSubmissions =
        await Submission.countDocuments();

      const pendingHodApproval =
        await Submission.countDocuments({
          status:
            "Pending HOD Approval"
        });

      const approvedByHod =
        await Submission.countDocuments({
          status:
            "Approved by HOD"
        });

      const pendingDeanReview =
        await Submission.countDocuments({
          status:
            "Pending Dean Review"
        });

      const approvedByDean =
        await Submission.countDocuments({
          status:
            "Approved by Dean"
        });

      const pendingAdminReview =
        await Submission.countDocuments({
          status:
            "Pending Admin Review"
        });

      res.status(200).json({
        success: true,

        stats: {
          totalUsers,
          totalFaculty,
          totalHod,
          totalDean,

          totalSubmissions,

          pendingHodApproval,
          approvedByHod,

          pendingDeanReview,
          approvedByDean,

          pendingAdminReview
        }
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };


// ==============================
// GET ALL USERS
// ==============================

exports.getAllUsers =
  async (req, res) => {
    try {

      const users =
        await User.find()
          .select("-password")
          .sort({
            createdAt: -1
          });

      res.status(200).json({
        success: true,
        count: users.length,
        users
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };


// ==============================
// GET ALL SUBMISSIONS
// ==============================

exports.getAllSubmissions =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find({
          $or: [

            {
              role: "faculty",
              status:
                "Approved by HOD"
            },

            {
              role: "hod",
              status:
                "Approved by Dean"
            },

            {
              role: "dean",
              status:
                "Pending Admin Review"
            },

            {
              role: "dean",
              status:
                "Submitted to Admin"
            }

          ]
        })
          .populate(
            "submittedBy",
            "name email role school department"
          )
          .sort({
            createdAt: -1
          });

      res.status(200).json({
        success: true,
        count: submissions.length,
        submissions
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };


// ==============================
// GET SUBMISSION DETAILS
// ==============================

exports.getSubmissionById =
  async (req, res) => {
    try {

      const submission =
        await Submission.findById(
          req.params.id
        ).populate(
          "submittedBy",
          "name email role school department designation employeeId"
        );

      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Submission not found"
        });
      }

      res.status(200).json({
        success: true,
        submission
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };