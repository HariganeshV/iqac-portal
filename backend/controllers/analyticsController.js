const Submission = require("../models/Submission");

// ==============================
// OVERALL ANALYTICS
// ==============================

exports.getOverallAnalytics =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find();

      const totalSubmissions =
        submissions.length;

      const totalQuestions =
        submissions.reduce(
          (sum, item) =>
            sum + item.totalQuestions,
          0
        );

      const totalAnswered =
        submissions.reduce(
          (sum, item) =>
            sum + item.answeredCount,
          0
        );

      const totalUnanswered =
        submissions.reduce(
          (sum, item) =>
            sum + item.unansweredCount,
          0
        );

      const completionPercentage =
        totalQuestions > 0
          ? (
              (totalAnswered /
                totalQuestions) *
              100
            ).toFixed(2)
          : 0;

      res.status(200).json({
        success: true,

        analytics: {
          totalSubmissions,
          totalQuestions,
          totalAnswered,
          totalUnanswered,
          completionPercentage
        }
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };