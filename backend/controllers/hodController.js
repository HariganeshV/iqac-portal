const Submission = require("../models/Submission");


// ==============================
// HOD SAVE QUESTIONNAIRE DRAFT
// ==============================

exports.saveHodSubmission = async (
  req,
  res
) => {
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
        submittedBy: req.user._id,
        role: "hod",
        school,
        department,
        quarter,
        year,
        answers,
        tableData,
        status: "Draft"
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
// HOD VIEW OWN SUBMISSIONS
// ==============================

exports.getMyHodSubmissions =
  async (req, res) => {
    try {
      const submissions =
        await Submission.find({
          submittedBy: req.user._id,
          role: "hod"
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
// HOD SUBMIT QUESTIONNAIRE
// ==============================

exports.submitHodSubmission =
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
        "Pending Dean Review";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "HOD Questionnaire Submitted Successfully",
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
// VIEW FACULTY SUBMISSIONS
// ==============================

exports.getFacultySubmissions =
  async (req, res) => {

    try {

      console.log(
        "HOD Department:",
        req.user.department
      );

      const submissions =
        await Submission.find({

          role: "faculty",

          department:
            req.user.department,

          status: {
            $in: [

              "Pending HOD Approval",

              "Approved by HOD",

              "Rejected by HOD"

            ]
          }

        })

        .populate(
          "submittedBy",
          "name email department school"
        )

        .sort({
          createdAt: -1
        });

      res.status(200).json({

        success: true,

        count:
          submissions.length,

        submissions

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

    console.log(
  "Logged HOD Department:",
  req.user.department
);

  };

// ==============================
// APPROVE FACULTY SUBMISSION
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
        "Approved by HOD";

      submission.hodRemarks =
        req.body.remarks ||
        "Approved by HOD";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "Faculty Submission Approved Successfully",
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
// REJECT FACULTY SUBMISSION
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
        "Rejected by HOD";

      submission.hodRemarks =
        req.body.remarks ||
        "Rejected by HOD";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "Faculty Submission Rejected Successfully",
        submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };