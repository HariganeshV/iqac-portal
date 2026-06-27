const Submission = require("../models/Submission");

// ==============================
// FILE PATH MAPPER
// ==============================

const mapUploadedFiles = (
  parsedAnswers,
  files
) => {

  if (!files || files.length === 0)
    return parsedAnswers;

  files.forEach((file) => {

    const parts =
      file.fieldname.split("_");

    const questionNo =
      parts[0];

    const answerObj =
      parsedAnswers.find(
        (a) =>
          String(a.questionNo) ===
          String(questionNo)
      );

    if (!answerObj)
      return;

    // --------------------------
    // SINGLE RECORD
    // Example:
    // 38_geoTagPhoto
    // --------------------------

    if (parts.length === 2) {

      const fieldKey =
        parts[1];

      if (
        typeof answerObj.answer !==
          "object" ||
        Array.isArray(
          answerObj.answer
        )
      ) {

        answerObj.answer = {};

      }

      answerObj.answer[
        fieldKey
      ] =
        `/uploads/hod/${file.filename}`;

    }

    // --------------------------
    // TABLE
    // Example:
    // 24_0_eventReport
    // --------------------------

    else if (
      parts.length >= 3
    ) {

      const rowIndex =
        Number(parts[1]);

      const fieldKey =
        parts
          .slice(2)
          .join("_");

      if (
        !Array.isArray(
          answerObj.answer
        )
      ) {

        answerObj.answer =
          [];

      }

      if (
        !answerObj.answer[
          rowIndex
        ]
      ) {

        answerObj.answer[
          rowIndex
        ] = {};

      }

      answerObj.answer[
        rowIndex
      ][fieldKey] =
        `/uploads/hod/${file.filename}`;

    }

  });

  return parsedAnswers;

};

// ==============================
// HOD SAVE QUESTIONNAIRE DRAFT
// ==============================
exports.saveHodSubmission = async (
  req,
  res
) => {

  console.log(req.body);

  try {

    const {
      school,
      department,
      quarter,
      year,
      answers,
      tableData,
      status,
      totalQuestions,
      answeredCount,
      unansweredCount
    } = req.body;

    let parsedAnswers = [];

    if (answers) {

      parsedAnswers =
        typeof answers === "string"
          ? JSON.parse(answers)
          : answers;

    }
    parsedAnswers =
  mapUploadedFiles(
    parsedAnswers,
    req.files
  );

    // ==========================
    // SAVE TO DATABASE
    // ==========================

    const submission =
      await Submission.findOneAndUpdate(

        {
          submittedBy:
            req.user._id,

          quarter,

          year,

          role: "hod"

        },

        {

          submittedBy:
            req.user._id,

          role: "hod",

          submittedByName:
            req.user.name,

          submittedByEmail:
            req.user.email,

          school,

          department,

          quarter,

          year,

          answers:
            parsedAnswers,

          tableData,

          totalQuestions:
            totalQuestions || 0,

          answeredCount:
            answeredCount || 0,

          unansweredCount:
            unansweredCount || 0,

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

      submission

    });

  }

  catch (error) {

    console.log(
      "HOD SAVE ERROR"
    );

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

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

exports.approveSubmission = async (req, res) => {

  try {

    console.log("Approve ID:", req.params.id);

    const submission =
      await Submission.findById(
        req.params.id
      );

    console.log("Submission:", submission);

    if (!submission) {

      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });

    }

    submission.status =
  "Approved by HOD";

submission.hodRemarks =
  "Approved by HOD";

await submission.save();

    res.status(200).json({
      success: true,
      message:
        "Faculty Submission Approved Successfully",
      submission
    });

  } catch (error) {

    console.log(
      "APPROVE ERROR:"
    );

    console.log(error);

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
// ==============================
// UPDATE HOD SUBMISSION
// ==============================

exports.updateHodSubmission =
async (req, res) => {

  try {

    const submission =
      await Submission.findById(
        req.params.id
      );

    if (!submission) {

      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });

    }

    const {
      school,
      department,
      totalQuestions,
      answeredCount,
      unansweredCount,
      tableData,
      status
    } = req.body;

    let parsedAnswers = [];

    if (req.body.answers) {

      parsedAnswers =
        typeof req.body.answers === "string"
          ? JSON.parse(req.body.answers)
          : req.body.answers;

    }

    // ==========================
    // KEEP OLD FILES
    // ==========================

    parsedAnswers.forEach((newAnswer) => {

      const oldAnswer =
        submission.answers.find(
          (a) =>
            String(a.questionNo) ===
            String(newAnswer.questionNo)
        );

      if (!oldAnswer)
        return;

      // ----------------------
      // SINGLE RECORD
      // ----------------------
      if(!newAnswer.answer){

newAnswer.answer={};

}
      if (
        typeof newAnswer.answer === "object" &&
        !Array.isArray(newAnswer.answer)
      ) {

        Object.keys(
          oldAnswer.answer || {}
        ).forEach((key) => {

          if (

            !newAnswer.answer[key] &&

            typeof oldAnswer.answer[key] === "string"

          ) {

            newAnswer.answer[key] =
              oldAnswer.answer[key];

          }

        });

      }

      // ----------------------
      // TABLE
      // ----------------------

      if (
        Array.isArray(
          newAnswer.answer
        )
      ) {

        newAnswer.answer.forEach(
          (row, rowIndex) => {

            if (
              !oldAnswer.answer?.[rowIndex]
            )
              return;

            Object.keys(
              oldAnswer.answer[rowIndex]
            ).forEach((key) => {

              if (

                !row[key] &&

                typeof oldAnswer.answer[rowIndex][key] ===
                  "string"

              ) {

                row[key] =
                  oldAnswer.answer[rowIndex][key];

              }

            });

          }
        );

      }

    });

    // ==========================
    // NEW FILE UPLOAD
    // ==========================

    parsedAnswers =
  mapUploadedFiles(
    parsedAnswers,
    req.files
  );

    // ==========================
    // SAVE
    // ==========================

    submission.answers =
      parsedAnswers;

    submission.tableData =
      tableData || {};

    submission.school =
      school;

    submission.department =
      department;

    submission.totalQuestions =
      totalQuestions || 0;

    submission.answeredCount =
      answeredCount || 0;

    submission.unansweredCount =
      unansweredCount || 0;

    submission.status =
      status || "Draft";

    await submission.save();

    res.status(200).json({

      success: true,

      message:
        "HOD Submission Updated Successfully",

      submission

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};