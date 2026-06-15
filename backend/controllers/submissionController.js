const Submission = require("../models/Submission");

exports.saveSubmission = async (req, res) => {
  try {
    const {
      role,
      school,
      department,
      quarter,
      year,
      answers,
      tableData,
      status
    } = req.body;

    const submission = await Submission.create({
      submittedBy: req.user._id,
      role,
      school,
      department,
      quarter,
      year,
      answers,
      tableData,
      status:
        status || "Draft"
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

exports.getMySubmissions = async (
  req,
  res
) => {
  try {
    const submissions =
      await Submission.find({
        submittedBy: req.user._id
      }).sort({
        createdAt: -1
      });

    res.json({
      success: true,
      submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSubmissionById = async (
  req,
  res
) => {
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

    res.json({
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