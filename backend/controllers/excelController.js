const ExcelJS = require("exceljs");

const Submission = require("../models/Submission");

// ======================================
// HELPER FUNCTION
// ======================================

const addSubmissionSheet = (
  workbook,
  sheetName,
  submissions
) => {
  const sheet =
    workbook.addWorksheet(
      sheetName
    );

  sheet.columns = [
    {
      header: "Name",
      key: "name",
      width: 30
    },
    {
      header: "Email",
      key: "email",
      width: 35
    },
    {
      header: "Employee ID",
      key: "employeeId",
      width: 20
    },
    {
      header: "Role",
      key: "role",
      width: 15
    },
    {
      header: "School",
      key: "school",
      width: 30
    },
    {
      header: "Department",
      key: "department",
      width: 40
    },
    {
      header: "Quarter",
      key: "quarter",
      width: 12
    },
    {
      header: "Year",
      key: "year",
      width: 12
    },
    {
      header: "Status",
      key: "status",
      width: 25
    },
    {
      header: "Answered",
      key: "answeredCount",
      width: 15
    },
    {
      header: "Unanswered",
      key: "unansweredCount",
      width: 15
    }
  ];

  submissions.forEach(
    (submission) => {
      sheet.addRow({
        name:
          submission
            .submittedBy?.name ||
          "",

        email:
          submission
            .submittedBy?.email ||
          "",

        employeeId:
          submission
            .submittedBy
            ?.employeeId || "",

        role:
          submission.role,

        school:
          submission.school,

        department:
          submission.department,

        quarter:
          submission.quarter,

        year:
          submission.year,

        status:
          submission.status,

        answeredCount:
          submission.answeredCount,

        unansweredCount:
          submission.unansweredCount
      });
    }
  );
};

// ======================================
// OVERALL REPORT
// ======================================

exports.downloadOverallExcelReport =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find()
          .populate(
            "submittedBy",
            "name email employeeId"
          );

      const workbook =
        new ExcelJS.Workbook();

      const faculty =
        submissions.filter(
          (item) =>
            item.role ===
            "faculty"
        );

      const hod =
        submissions.filter(
          (item) =>
            item.role ===
            "hod"
        );

      const dean =
        submissions.filter(
          (item) =>
            item.role ===
            "dean"
        );

      addSubmissionSheet(
        workbook,
        "Faculty Submissions",
        faculty
      );

      addSubmissionSheet(
        workbook,
        "HOD Submissions",
        hod
      );

      addSubmissionSheet(
        workbook,
        "Dean Submissions",
        dean
      );

      const analytics =
        workbook.addWorksheet(
          "Analytics Summary"
        );

      const totalQuestions =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.totalQuestions ||
              0),
          0
        );

      const totalAnswered =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.answeredCount ||
              0),
          0
        );

      const totalUnanswered =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.unansweredCount ||
              0),
          0
        );

      analytics.addRow([
        "Total Submissions",
        submissions.length
      ]);

      analytics.addRow([
        "Total Questions",
        totalQuestions
      ]);

      analytics.addRow([
        "Answered Questions",
        totalAnswered
      ]);

      analytics.addRow([
        "Unanswered Questions",
        totalUnanswered
      ]);

      analytics.addRow([
        "Completion %",
        totalQuestions > 0
          ? (
              (totalAnswered /
                totalQuestions) *
              100
            ).toFixed(2)
          : 0
      ]);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=IQAC_Report.xlsx"
      );

      await workbook.xlsx.write(
        res
      );

      res.end();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

// ======================================
// SCHOOL WISE REPORT
// ======================================

exports.downloadSchoolExcelReport =
  async (req, res) => {
    try {

      const schoolName =
        req.params.school;

      const submissions =
        await Submission.find({
          school: schoolName
        }).populate(
          "submittedBy",
          "name email employeeId"
        );

      const workbook =
        new ExcelJS.Workbook();

      const faculty =
        submissions.filter(
          (item) =>
            item.role ===
            "faculty"
        );

      const hod =
        submissions.filter(
          (item) =>
            item.role ===
            "hod"
        );

      const dean =
        submissions.filter(
          (item) =>
            item.role ===
            "dean"
        );

      addSubmissionSheet(
        workbook,
        "Faculty Submissions",
        faculty
      );

      addSubmissionSheet(
        workbook,
        "HOD Submissions",
        hod
      );

      addSubmissionSheet(
        workbook,
        "Dean Submissions",
        dean
      );

      const analytics =
        workbook.addWorksheet(
          "School Analytics"
        );

      const totalQuestions =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.totalQuestions ||
              0),
          0
        );

      const totalAnswered =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.answeredCount ||
              0),
          0
        );

      const totalUnanswered =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.unansweredCount ||
              0),
          0
        );

      const completion =
        totalQuestions > 0
          ? (
              (totalAnswered /
                totalQuestions) *
              100
            ).toFixed(2)
          : 0;

      analytics.addRow([
        "School",
        schoolName
      ]);

      analytics.addRow([
        "Total Submissions",
        submissions.length
      ]);

      analytics.addRow([
        "Faculty Submissions",
        faculty.length
      ]);

      analytics.addRow([
        "HOD Submissions",
        hod.length
      ]);

      analytics.addRow([
        "Dean Submissions",
        dean.length
      ]);

      analytics.addRow([
        "Total Questions",
        totalQuestions
      ]);

      analytics.addRow([
        "Answered Questions",
        totalAnswered
      ]);

      analytics.addRow([
        "Unanswered Questions",
        totalUnanswered
      ]);

      analytics.addRow([
        "Completion %",
        completion
      ]);

      const fileName =
        schoolName.replace(
          /\s+/g,
          "_"
        ) +
        "_Report.xlsx";

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}`
      );

      await workbook.xlsx.write(
        res
      );

      res.end();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

// ======================================
// DEPARTMENT WISE REPORT
// ======================================

exports.downloadDepartmentExcelReport =
  async (req, res) => {
    try {

      const departmentName =
        req.params.department;

      const departmentSubmissions =
        await Submission.find({
          department:
            departmentName
        }).populate(
          "submittedBy",
          "name email employeeId"
        );

      if (
        departmentSubmissions.length ===
        0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "No submissions found for this department"
        });
      }

      const schoolName =
        departmentSubmissions[0]
          .school;

      const deanSubmissions =
        await Submission.find({
          school: schoolName,
          role: "dean"
        }).populate(
          "submittedBy",
          "name email employeeId"
        );

      const workbook =
        new ExcelJS.Workbook();

      const faculty =
        departmentSubmissions.filter(
          (item) =>
            item.role ===
            "faculty"
        );

      const hod =
        departmentSubmissions.filter(
          (item) =>
            item.role ===
            "hod"
        );

      addSubmissionSheet(
        workbook,
        "Faculty Submissions",
        faculty
      );

      addSubmissionSheet(
        workbook,
        "HOD Submissions",
        hod
      );

      addSubmissionSheet(
        workbook,
        "School Dean Submission",
        deanSubmissions
      );

      const analytics =
        workbook.addWorksheet(
          "Department Analytics"
        );

      const allSubmissions = [
        ...departmentSubmissions,
        ...deanSubmissions
      ];

      const totalQuestions =
        allSubmissions.reduce(
          (sum, item) =>
            sum +
            (item.totalQuestions ||
              0),
          0
        );

      const totalAnswered =
        allSubmissions.reduce(
          (sum, item) =>
            sum +
            (item.answeredCount ||
              0),
          0
        );

      const totalUnanswered =
        allSubmissions.reduce(
          (sum, item) =>
            sum +
            (item.unansweredCount ||
              0),
          0
        );

      const completion =
        totalQuestions > 0
          ? (
              (totalAnswered /
                totalQuestions) *
              100
            ).toFixed(2)
          : 0;

      analytics.addRow([
        "Department Name",
        departmentName
      ]);

      analytics.addRow([
        "School Name",
        schoolName
      ]);

      analytics.addRow([
        "Faculty Submissions",
        faculty.length
      ]);

      analytics.addRow([
        "HOD Submissions",
        hod.length
      ]);

      analytics.addRow([
        "Dean Submissions",
        deanSubmissions.length
      ]);

      analytics.addRow([
        "Total Questions",
        totalQuestions
      ]);

      analytics.addRow([
        "Answered Questions",
        totalAnswered
      ]);

      analytics.addRow([
        "Unanswered Questions",
        totalUnanswered
      ]);

      analytics.addRow([
        "Completion %",
        completion
      ]);

      const fileName =
        departmentName.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        ) +
        "_Report.xlsx";

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}`
      );

      await workbook.xlsx.write(
        res
      );

      res.end();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };