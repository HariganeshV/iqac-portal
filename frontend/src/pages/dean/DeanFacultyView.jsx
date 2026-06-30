import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DeanLayout from "../../layouts/DeanLayout";

import {
  getFacultySubmissionById
} from "../../api/deanApi";

function DeanFacultyView() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadSubmission();

  }, []);

  const loadSubmission = async () => {

    try {

      const res =
        await getFacultySubmissionById(id);

      setSubmission(res.data.submission);

    }

    catch (err) {

      console.error(err);

    }

    finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <DeanLayout>

        <div style={{ padding: 40 }}>
          Loading...
        </div>

      </DeanLayout>

    );

  }

  if (!submission) {

    return (

      <DeanLayout>

        <div style={{ padding: 40 }}>
          Submission Not Found
        </div>

      </DeanLayout>

    );

  }

  return (

    <DeanLayout>

      <div
        style={{
          padding: "35px",
          maxWidth: "1300px",
          margin: "0 auto"
        }}
      >

        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "25px"
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            marginBottom: "25px",
            color: "#1e293b"
          }}
        >
          Faculty Submission Details
        </h1>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            padding: "25px",
            marginBottom: "35px"
          }}
        >

          <h2
            style={{
              marginBottom: "20px",
              color: "#2563eb"
            }}
          >
            Faculty Information
          </h2>

          <table
            style={{
              width: "100%"
            }}
          >

            <tbody>

              <InfoRow
                title="Faculty Name"
                value={submission.submittedByName}
              />

              <InfoRow
                title="Email"
                value={submission.submittedByEmail}
              />

              <InfoRow
                title="School"
                value={submission.school}
              />

              <InfoRow
                title="Department"
                value={submission.department}
              />

              <InfoRow
                title="Quarter"
                value={submission.quarter}
              />

              <tr>

                <td
                  style={infoTitle}
                >
                  Status
                </td>

                <td
                  style={infoValue}
                >

                  <span
                    style={{
                      background:
                        "#16a34a",
                      color: "#fff",
                      padding:
                        "6px 12px",
                      borderRadius:
                        "20px",
                      fontWeight: "600"
                    }}
                  >
                    {submission.status}
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <h2
          style={{
            marginBottom: "20px",
            color: "#2563eb"
          }}
        >
          Faculty Answers
        </h2>

        <div
          style={{
            overflowX: "auto",
            background: "#fff",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,.08)"
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >

            <thead>

              <tr
                style={{
                  background:
                    "#2563eb",
                  color: "#fff"
                }}
              >

                <th style={thStyle}>
                  S.No
                </th>

                <th style={thStyle}>
                  Question
                </th>

                <th style={thStyle}>
                  Response
                </th>

              </tr>

            </thead>

            <tbody>

              {submission.answers.map(
                (answer, index) => {

                  const value =
                    answer.answer || "";

                  const isImage =
                    value.endsWith(".jpg") ||
                    value.endsWith(".jpeg") ||
                    value.endsWith(".png");

                  const isFile =
                    value.endsWith(".pdf") ||
                    value.endsWith(".doc") ||
                    value.endsWith(".docx");

                  return (

                    <tr
                      key={index}
                    >

                      <td style={tdStyle}>
                        {index + 1}
                      </td>

                      <td style={tdStyle}>
                        {answer.question}
                      </td>

                      <td style={tdStyle}>

                        {

                          isImage ?

                          <a
                            href={`http://localhost:5000${value}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={`http://localhost:5000${value}`}
                              alt=""
                              style={{
                                width: "90px",
                                height: "90px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border:
                                  "1px solid #ddd"
                              }}
                            />
                          </a>

                          :

                          isFile ?

                          <a
                            href={`http://localhost:5000${value}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color:
                                "#2563eb",
                              fontWeight:
                                "600",
                              textDecoration:
                                "none"
                            }}
                          >
                            📄 View File
                          </a>

                          :

                          value

                        }

                      </td>

                    </tr>

                  );

                }

              )}

            </tbody>

          </table>

        </div>

      </div>

    </DeanLayout>

  );

}

function InfoRow({
  title,
  value
}) {

  return (

    <tr>

      <td
        style={infoTitle}
      >
        {title}
      </td>

      <td
        style={infoValue}
      >
        {value}
      </td>

    </tr>

  );

}

const infoTitle = {

  padding: "12px",

  fontWeight: "700",

  width: "220px",

  color: "#374151"

};

const infoValue = {

  padding: "12px",

  color: "#111827"

};

const thStyle = {

  padding: "15px",

  textAlign: "left",

  fontWeight: "600"

};

const tdStyle = {

  padding: "15px",

  borderBottom:
    "1px solid #e5e7eb",

  verticalAlign: "top"

};

export default DeanFacultyView;