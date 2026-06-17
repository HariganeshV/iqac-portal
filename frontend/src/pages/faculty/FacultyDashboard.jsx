import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FacultyLayout from "../../layouts/FacultyLayout";
import { getMySubmissions } from "../../api/submissionApi";

function FacultyDashboard() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [submissions, setSubmissions] =
    useState([]);

  useEffect(() => {

    loadMySubmissions();

  }, []);

  const loadMySubmissions =
    async () => {

      try {

        const response =
          await getMySubmissions();

        setSubmissions(
          response.data.submissions || []
        );

      } catch (error) {

        console.error(
          "Failed to load submissions",
          error
        );

      }

    };

  const quarterStatus = {
    Q1: "Not Started",
    Q2: "Not Started",
    Q3: "Not Started",
    Q4: "Not Started"
  };

  submissions.forEach(
    (submission) => {

      quarterStatus[
        submission.quarter
      ] =
        submission.status;

    }
  );

  const submittedCount =
    submissions.length;

  const approvedCount =
    submissions.filter(
      (s) =>
        s.status.includes(
          "Approved"
        )
    ).length;

  const pendingCount =
    submissions.filter(
      (s) =>
        s.status.includes(
          "Pending"
        )
    ).length;

  const draftCount =
    submissions.filter(
      (s) =>
        s.status === "Draft"
    ).length;

  const notStartedCount =
    4 - submissions.length;

  return (

    <FacultyLayout>

      {/* Welcome Banner */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#1e40af)",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          marginBottom: "30px"
        }}
      >

        <h1
          style={{
            margin: 0
          }}
        >
          Welcome, {user?.name}
        </h1>

        <p
          style={{
            marginTop: "10px",
            opacity: 0.9
          }}
        >
          {user?.department}
        </p>

        <p
          style={{
            opacity: 0.8
          }}
        >
          {user?.school}
        </p>

      </div>

      {/* Statistics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}
      >

        <div className="stat-card">
          <h2>
            {submittedCount}
          </h2>
          <p>
            Submitted Quarters
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {approvedCount}
          </h2>
          <p>
            Approved
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {pendingCount}
          </h2>
          <p>
            Pending Approval
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {draftCount}
          </h2>
          <p>
            Draft Reports
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {notStartedCount}
          </h2>
          <p>
            Not Started
          </p>
        </div>

      </div>

      {/* Quarter Status */}

      <h2
        style={{
          marginBottom: "20px"
        }}
      >
        Quarter Status
      </h2>

      <div
        className="status-card"
      >

        {
          Object.entries(
            quarterStatus
          ).map(
            (
              [quarter, status]
            ) => (

              <div
                key={quarter}
                className="status-row"
              >

                <span>
                  {quarter}
                </span>

                <strong
                  style={{
                    color:
                      status ===
                      "Not Started"
                        ? "#ef4444"
                        : status.includes(
                            "Pending"
                          )
                        ? "#f59e0b"
                        : status.includes(
                            "Approved"
                          )
                        ? "#16a34a"
                        : "#2563eb"
                  }}
                >
                  {status}
                </strong>

              </div>

            )
          )
        }

      </div>

      {/* Quick Actions */}

      <h2
        style={{
          marginTop: "40px",
          marginBottom: "20px"
        }}
      >
        Quick Actions
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px"
        }}
      >

        <div className="action-card">

          <h3>
            📝 Questionnaire
          </h3>

          <p>
            Fill quarterly IQAC questionnaire
          </p>

          <button
            onClick={() =>
              navigate(
                "/faculty/questionnaire"
              )
            }
          >
            Open
          </button>

        </div>

        <div className="action-card">

          <h3>
            📂 My Submissions
          </h3>

          <p>
            View all submitted reports
          </p>

          <button
            onClick={() =>
              navigate(
                "/faculty/submissions"
              )
            }
          >
            View
          </button>

        </div>

      </div>

      <style>

        {`

        .stat-card{
          background:white;
          padding:25px;
          border-radius:15px;
          box-shadow:0 4px 15px rgba(0,0,0,0.08);
          text-align:center;
        }

        .stat-card h2{
          color:#2563eb;
          margin:0;
          font-size:32px;
        }

        .status-card{
          background:white;
          padding:25px;
          border-radius:15px;
          box-shadow:0 4px 15px rgba(0,0,0,0.08);
        }

        .status-row{
          display:flex;
          justify-content:space-between;
          padding:15px 0;
          border-bottom:1px solid #e5e7eb;
        }

        .status-row:last-child{
          border-bottom:none;
        }

        .action-card{
          background:white;
          padding:25px;
          border-radius:15px;
          box-shadow:0 4px 15px rgba(0,0,0,0.08);
        }

        .action-card button{
          margin-top:10px;
          background:#2563eb;
          color:white;
          border:none;
          padding:10px 20px;
          border-radius:8px;
          cursor:pointer;
        }

        .action-card button:hover{
          background:#1d4ed8;
        }

        `}

      </style>

    </FacultyLayout>

  );

}

export default FacultyDashboard;