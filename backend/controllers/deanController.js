const Submission = require("../models/Submission");


// ==============================
// SAVE DEAN QUESTIONNAIRE
// ==============================

exports.saveDeanSubmission =
  async (req, res) => {
    try {
      const {
        school,
        department,
        quarter,
        year,
        answers,
        tableData
      } = req.body;

      const submission =
  await Submission.create({

    submittedBy:
      req.user._id,

    submittedByName:
      req.user.name,

    submittedByEmail:
      req.user.email,

    role:
      "dean",

    school,

    department,

    quarter,

    year,

    answers,

    tableData,

    status:
      "Draft"

  });

      res.status(201).json({
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


// ==============================
// VIEW OWN DEAN SUBMISSIONS
// ==============================

exports.getMyDeanSubmissions =
  async (req, res) => {
    try {
      const submissions =
        await Submission.find({
          submittedBy: req.user._id,
          role: "dean"
        }).sort({
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
// SUBMIT DEAN QUESTIONNAIRE
// ==============================

exports.submitDeanSubmission =
  async (req, res) => {
    try {
      const submission =
        await Submission.findById(
          req.params.id
        );

      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Submission not found"
        });
      }

      submission.status =
        "Pending Admin Review";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "Dean Questionnaire Submitted Successfully",
        submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };


// ==============================
// VIEW HOD SUBMISSIONS
// ==============================

exports.getHodSubmissions =
  async (req, res) => {
    try {
      const submissions =
        await Submission.find({
          role: "hod",
          status:
            "Pending Dean Review"
        })
          .populate(
            "submittedBy",
            "name email school department designation employeeId"
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
// FACULTY REVIEW
// ==============================

exports.getFacultySubmissions =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find({
          role: "faculty",
          status:
            "Approved by HOD"
        })
          .populate(
            "submittedBy",
            "name email school department designation employeeId"
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
        message:
          error.message
      });

    }
  };

// ==============================
// APPROVE HOD SUBMISSION
// ==============================

exports.approveSubmission =
  async (req, res) => {
    try {
      const submission =
        await Submission.findById(
          req.params.id
        );

      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Submission not found"
        });
      }

      submission.status =
        "Approved by Dean";

      submission.deanRemarks =
        req.body.remarks ||
        "Approved by Dean";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "HOD Submission Approved Successfully",
        submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };


// ==============================
// REJECT HOD SUBMISSION
// ==============================

exports.rejectSubmission =
  async (req, res) => {
    try {
      const submission =
        await Submission.findById(
          req.params.id
        );

      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Submission not found"
        });
      }

      submission.status =
        "Rejected by Dean";

      submission.deanRemarks =
        req.body.remarks ||
        "Rejected by Dean";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "HOD Submission Rejected Successfully",
        submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };