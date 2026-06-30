import API from "./axios";

// ==============================
// FACULTY REVIEW
// ==============================

export const getFacultySubmissions = () =>
  API.get("/dean/faculty-submissions");

// ==============================
// HOD REVIEW
// ==============================

export const getHodSubmissions = () =>
  API.get("/dean/hod-submissions");

// ==============================
// APPROVE / REJECT
// ==============================

export const approveSubmission = (id, remarks) =>
  API.put(`/dean/approve/${id}`, {
    remarks
  });

export const rejectSubmission = (id, remarks) =>
  API.put(`/dean/reject/${id}`, {
    remarks
  });

// ==============================
// DEAN QUESTIONNAIRE
// ==============================

export const saveDeanSubmission = (data) =>
  API.post("/dean/save", data);

export const submitDeanSubmission = (id) =>
  API.put(`/dean/submit/${id}`);

export const getMyDeanSubmissions = () =>
  API.get("/dean/my");

// ==============================
// PDF
// ==============================

export const downloadFacultyPDF = (id) =>
  API.get(
    `/submissions/download/${id}`,
    {
      responseType: "blob"
    }
  );

  export const getFacultySubmissionById = (id) =>
  API.get(`/dean/faculty-submission/${id}`);