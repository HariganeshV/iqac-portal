import { useEffect, useState } from "react";

import {
  getFacultySubmissions,
  approveSubmission,
  rejectSubmission
} from "../../api/hodApi";

function FacultyReview() {

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [remarks, setRemarks] =
    useState({});

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  useEffect(() => {

    fetchSubmissions();

  }, []);

  const fetchSubmissions =
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

  const handleApprove =
    async (id) => {

      try {

        await approveSubmission(id);

        alert(
          "Submission Approved Successfully"
        );

        fetchSubmissions();

      } catch (error) {

        console.error(error);

        alert(
          "Approval Failed"
        );

      }

    };

  const handleReject =
    async (id) => {

      try {

        const reason =
          remarks[id] || "";

        if (!reason.trim()) {

          alert(
            "Please enter rejection reason"
          );

          return;

        }

        await rejectSubmission(
          id,
          reason
        );

        alert(
          "Submission Rejected Successfully"
        );

        fetchSubmissions();

      } catch (error) {

        console.error(error);

        alert(
          "Reject Failed"
        );

      }

    };

  return (

    <div
      style={{
        padding: "30px"
      }}
    >

      <h1>
        Faculty Reviews
      </h1>

      <p>
        Review Faculty Quarterly Reports
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
            marginTop: "20px",
            borderCollapse:
              "collapse"
          }}
        >

          <thead>

            <tr>

              <th style={thStyle}>
                Faculty
              </th>

              <th style={thStyle}>
                Email
              </th>

              <th style={thStyle}>
                Quarter
              </th>

              <th style={thStyle}>
                Answered
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Remarks
              </th>

              <th style={thStyle}>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {

              submissions.map(
                (
                  item
                ) => (

                  <tr
                    key={
                      item._id
                    }
                  >

                    <td style={tdStyle}>
                      {
                        item.facultyName
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        item.facultyEmail
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        item.quarter
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        item.answeredCount
                      }
                      /
                      {
                        item.totalQuestions
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        item.status
                      }
                    </td>

                    <td style={tdStyle}>

                      <textarea
                        rows="2"
                        placeholder="Reason if rejecting..."
                        value={
                          remarks[item._id] || ""
                        }
                        onChange={(e) =>
                          setRemarks({
                            ...remarks,
                            [item._id]:
                              e.target.value
                          })
                        }
                        style={{
                          width: "100%"
                        }}
                      />

                    </td>

                    <td style={tdStyle}>

                      <button
                        onClick={() =>
                          setSelectedSubmission(
                            item
                          )
                        }
                        style={viewBtn}
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleApprove(
                            item._id
                          )
                        }
                        style={approveBtn}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleReject(
                            item._id
                          )
                        }
                        style={rejectBtn}
                      >
                        Reject
                      </button>

                    </td>

                  </tr>

                )
              )

            }

          </tbody>

        </table>

      }

      {

        selectedSubmission && (

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center"
            }}
          >

            <div
              style={{
                background: "white",
                padding: "25px",
                width: "80%",
                maxHeight:
                  "80vh",
                overflowY:
                  "auto",
                borderRadius:
                  "12px"
              }}
            >

              <h2>
  Faculty Answers
</h2>

<div
  style={{
    marginBottom: "20px",
    background: "#f3f4f6",
    padding: "15px",
    borderRadius: "8px"
  }}
>
  <p>
    <strong>Faculty :</strong>
    {" "}
    {selectedSubmission.facultyName}
  </p>

  <p>
    <strong>Email :</strong>
    {" "}
    {selectedSubmission.facultyEmail}
  </p>

  <p>
    <strong>Quarter :</strong>
    {" "}
    {selectedSubmission.quarter}
  </p>

  <p>
    <strong>Total Questions :</strong>
    {" "}
    {selectedSubmission.totalQuestions}
  </p>

  <p>
    <strong>Answered :</strong>
    {" "}
    {selectedSubmission.answeredCount}
  </p>

  <p>
    <strong>Unanswered :</strong>
    {" "}
    {selectedSubmission.unansweredCount}
  </p>

</div>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse"
  }}
>
  <thead>

    <tr>

       <th style={thStyle}>
         Question Key
       </th>

      <th style={thStyle}>
        Answer
      </th>

    </tr>

  </thead>

  <tbody>

    {
      selectedSubmission.answers?.map(
        (answer, index) => (

          <tr key={index}>

            <td style={tdStyle}>
              {
                answer.question
              }
            </td>

            <td style={tdStyle}>
              {
                answer.answer
                  ? String(answer.answer)
                  : "Not Answered"
              }
            </td>

          </tr>

        )
      )
    }

  </tbody>

</table>
      
         <button
  onClick={() =>
    setSelectedSubmission(null)
  }
  style={{
    marginTop: "20px",
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Close
</button>

            </div>

          </div>

        )

      }

    </div>

  );

}

const thStyle = {

  padding: "12px",

  background:
    "#2563eb",

  color:
    "white",

  textAlign:
    "left"

};

const tdStyle = {

  padding: "12px",

  borderBottom:
    "1px solid #e5e7eb",

  verticalAlign:
    "top"

};

const viewBtn = {

  background:
    "#2563eb",

  color:
    "white",

  border:
    "none",

  padding:
    "8px 12px",

  marginRight:
    "5px",

  cursor:
    "pointer",

  borderRadius:
    "5px"

};

const approveBtn = {

  background:
    "#16a34a",

  color:
    "white",

  border:
    "none",

  padding:
    "8px 12px",

  marginRight:
    "5px",

  cursor:
    "pointer",

  borderRadius:
    "5px"

};

const rejectBtn = {

  background:
    "#dc2626",

  color:
    "white",

  border:
    "none",

  padding:
    "8px 12px",

  cursor:
    "pointer",

  borderRadius:
    "5px"

};

export default FacultyReview;