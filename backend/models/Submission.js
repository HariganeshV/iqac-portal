const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      required: true
    },

    school: {
      type: String,
      required: true
    },

    department: {
      type: String,
      default: ""
    },

    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Pending HOD Approval",
        "Pending Dean Approval",
        "Pending Admin Review",
        "Approved",
        "Rejected"
      ],
      default: "Draft"
    },

    answers: {
      type: Object,
      default: {}
    },

    tableData: {
      type: Object,
      default: {}
    },

    uploadedFiles: [
      {
        fileName: String,
        filePath: String
      }
    ],

    hodRemarks: {
      type: String,
      default: ""
    },

    deanRemarks: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);