import API from "./submissionApi";

// Faculty submissions waiting for HOD

export const getFacultySubmissions =
  () =>
    API.get(
      "/hod/faculty-submissions"
    );

// Approve Faculty Submission

export const approveSubmission =
  (id) =>
    API.put(
      `/hod/approve/${id}`
    );

// Reject Faculty Submission

export const rejectSubmission =
  (id, remarks) =>
    API.put(
      `/hod/reject/${id}`,
      {
        remarks
      }
    );

    export const downloadFacultyPDF =
  (id) =>
    API.get(
      `/submissions/download/${id}`,
      {
        responseType: "blob"
      }
    );