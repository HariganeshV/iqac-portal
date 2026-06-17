const Submission = require("../models/Submission");

// ==============================
// SAVE DRAFT SUBMISSION
// ==============================

exports.saveSubmission = async (
  req,
  res
) => {
  try {

    const {
      role,
      school,
      department,
      quarter,
      year,

      totalQuestions,
      answeredCount,
      unansweredCount,

      answers,
      tableData,
      status
    } = req.body;

    const submission =
      await Submission.findOneAndUpdate(

        {
          submittedBy:
            req.user._id,

          quarter,

          year
        },

         {
  submittedBy:
    req.user._id,

  facultyName:
    req.user.name,

  facultyEmail:
    req.user.email,

  role,
  school,
  department,

  quarter,
  year,

  totalQuestions:
    totalQuestions || 0,

  answeredCount:
    answeredCount || 0,

  unansweredCount:
    unansweredCount || 0,

  answers:
    answers || [],

  tableData:
    tableData || {},

  status:
    status || "Draft"
},

        {
          new: true,
          upsert: true,
          runValidators: true
        }

      );

    res.status(200).json({
      success: true,
      message:
        "Submission saved successfully",
      submission
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
// GET MY SUBMISSIONS
// ==============================

exports.getMySubmissions =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find({
          submittedBy: req.user._id
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
// GET SUBMISSION BY ID
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


// ==============================
// SUBMIT QUESTIONNAIRE
// ==============================

exports.submitQuestionnaire =
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
        "Pending HOD Approval";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "Questionnaire submitted successfully",
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
// UPDATE SUBMISSION
// ==============================

exports.updateSubmission =
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

      submission.answers =
        req.body.answers || [];

      submission.tableData =
        req.body.tableData || {};

      submission.totalQuestions =
        req.body.totalQuestions || 0;

      submission.answeredCount =
        req.body.answeredCount || 0;

      submission.unansweredCount =
        req.body.unansweredCount || 0;

      submission.school =
        req.body.school;

      submission.department =
        req.body.department;

      submission.facultyName =
        req.user.name;

      submission.facultyEmail =
        req.user.email;

      // Re-submit to HOD

      submission.status =
        "Pending HOD Approval";

      // Clear old rejection reason

      submission.hodRemarks =
        "";

      await submission.save();

      res.status(200).json({

        success: true,

        message:
          "Submission updated successfully",

        submission

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  };