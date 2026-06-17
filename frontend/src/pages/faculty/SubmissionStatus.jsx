import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FacultyLayout from "../../layouts/FacultyLayout";

import {
  getMySubmissions
} from "../../api/submissionApi";

function SubmissionStatus() {

  const navigate = useNavigate();

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchSubmissions();

  }, []);

  const fetchSubmissions =
    async () => {

      try {

        const response =
          await getMySubmissions();

        setSubmissions(
          response.data.submissions || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const quarters = [
    "Q1",
    "Q2",
    "Q3",
    "Q4"
  ];

  const getQuarterData =
    (quarter) => {

      const submission =
        submissions.find(
          (item) =>
            item.quarter === quarter
        );

      if (!submission) {

        return {

          status:
            "Not Started",

          date:
            "-",

          totalQuestions:
            0,

          answeredCount:
            0,

          unansweredCount:
            0,

          hodRemarks:
            "-",

          submissionId:
            null

        };

      }

      return {

        status:
          submission.status,

        date:
          new Date(
            submission.createdAt
          ).toLocaleDateString(),

        totalQuestions:
          submission.totalQuestions || 0,

        answeredCount:
          submission.answeredCount || 0,

        unansweredCount:
          submission.unansweredCount || 0,

        hodRemarks:
          submission.hodRemarks || "-",

        submissionId:
          submission._id

      };

    };

  const handleEdit =
    (submissionId) => {

      navigate(
        `/faculty/questionnaire/${submissionId}`
      );

    };

  return (

    <FacultyLayout>

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >

        <h1>
          My Submissions
        </h1>

        <p>
          View Quarterly Submission Status
        </p>

        {

          loading ?

          <p>
            Loading...
          </p>

          :

          <table
            style={{
              width: "100%",
              marginTop: "25px",
              borderCollapse:
                "collapse"
            }}
          >

            <thead>

              <tr
                style={{
                  background:
                    "#2563eb",
                  color:
                    "white"
                }}
              >

                <th style={thStyle}>
                  Quarter
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Rejection Reason
                </th>

                <th style={thStyle}>
                  Total Questions
                </th>

                <th style={thStyle}>
                  Answered
                </th>

                <th style={thStyle}>
                  Unanswered
                </th>

                <th style={thStyle}>
                  Submitted Date
                </th>

                <th style={thStyle}>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {

                quarters.map(
                  (
                    quarter
                  ) => {

                    const info =
                      getQuarterData(
                        quarter
                      );

                    return (

                      <tr
                        key={
                          quarter
                        }
                      >

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            quarter
                          }
                        </td>

                        <td
                          style={{
                            ...tdStyle,

                            color:

                              info.status ===
                              "Pending HOD Approval"

                                ? "#f59e0b"

                              : info.status ===
                                "Approved by HOD"

                                ? "#16a34a"

                              : info.status ===
                                "Rejected by HOD"

                                ? "#ef4444"

                              : info.status ===
                                "Pending Dean Review"

                                ? "#2563eb"

                              : info.status ===
                                "Approved by Dean"

                                ? "#16a34a"

                              : "#ef4444",

                            fontWeight:
                              "600"
                          }}
                        >
                          {
                            info.status
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.hodRemarks
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.totalQuestions
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.answeredCount
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.unansweredCount
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.date
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >

                          {

                            info.submissionId && (

                              <button
                                onClick={() =>
                                  handleEdit(
                                    info.submissionId
                                  )
                                }
                                style={{
                                  background:
                                    "#2563eb",
                                  color:
                                    "#fff",
                                  border:
                                    "none",
                                  padding:
                                    "8px 15px",
                                  borderRadius:
                                    "6px",
                                  cursor:
                                    "pointer"
                                }}
                              >
                                Edit
                              </button>

                            )

                          }

                        </td>

                      </tr>

                    );

                  }
                )

              }

            </tbody>

          </table>

        }

      </div>

    </FacultyLayout>

  );

}

const thStyle = {

  padding: "12px",

  textAlign: "left"

};

const tdStyle = {

  padding: "12px",

  borderBottom:
    "1px solid #e5e7eb"

};

export default SubmissionStatus;