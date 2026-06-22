import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HodLayout from "../../layouts/HodLayout";
import { useAuth } from "../../context/AuthContext";


import {
  getFacultySubmissions
} from "../../api/hodApi";

function HodDashboard() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData =
    async () => {

      try {

        const response =
          await getFacultySubmissions();

        setSubmissions(
          response.data.submissions || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const pendingReviews =
    submissions.filter(
      (s) =>
        s.status ===
        "Pending HOD Approval"
    );

  const approvedReviews =
    submissions.filter(
      (s) =>
        s.status ===
        "Approved by HOD"
    );

  const rejectedReviews =
    submissions.filter(
      (s) =>
        s.status ===
        "Rejected by HOD"
    );

  return (

  <HodLayout>

    <div
      style={{
        background: "#f3f4f6",
        minHeight: "100vh"
      }}
    >

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
    fontSize: "16px"
  }}
>
  Department : {user?.department}
</p>

<p
  style={{
    marginTop: "5px",
    fontSize: "16px"
  }}
>
  School : {user?.school}
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

        <div
          className="stat-card"
          onClick={() =>
  navigate(
    "/hod/faculty-review?tab=pending"
  )
}
        >

          <h2>
            {
              pendingReviews.length
            }
          </h2>

          <p>
            Pending Reviews
          </p>

        </div>

        <div
          className="stat-card"
          onClick={() =>
  navigate(
    "/hod/faculty-review?tab=approved"
  )
}
        >

          <h2>
            {
              approvedReviews.length
            }
          </h2>

          <p>
            Approved Reviews
          </p>

        </div>

        <div
          className="stat-card"
          onClick={() =>
  navigate(
    "/hod/faculty-review?tab=rejected"
  )
}
        >

          <h2>
            {
              rejectedReviews.length
            }
          </h2>

          <p>
            Rejected Reviews
          </p>

        </div>

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

        <div
          className="action-card"
        >

          <h3>
            📋 Faculty Reviews
          </h3>

          <p>
            Review Faculty Reports
          </p>

          <button
            onClick={() =>
              navigate(
                "/hod/faculty-review"
              )
            }
          >
            Open
          </button>

        </div>

        <div
          className="action-card"
        >

          <h3>
            📝 HOD Questionnaire
          </h3>

          <p>
            Fill Quarterly HOD Report
          </p>

          <button
            onClick={() =>
              navigate(
                "/hod/questionnaire"
              )
            }
          >
            Open
          </button>

        </div>

        <div
          className="action-card"
        >

          <h3>
            📂 My HOD Submissions
          </h3>

          <p>
            View Submitted Reports
          </p>

          <button
            onClick={() =>
              navigate(
                "/hod/submissions"
              )
            }
          >
            Open
          </button>

        </div>

      </div>

      <style>

        {`

          .stat-card{

            background:white;
            padding:25px;
            border-radius:15px;
            text-align:center;
            cursor:pointer;
            box-shadow:0 4px 15px rgba(0,0,0,0.08);

          }

          .stat-card:hover{

            transform:translateY(-3px);

          }

          .stat-card h2{

            color:#2563eb;
            margin:0;
            font-size:32px;

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

        `}

      </style>

       </div>

  </HodLayout>

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

export default HodDashboard;