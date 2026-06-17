import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import FacultyDashboard
from "./pages/faculty/FacultyDashboard";

import FacultyQuestionnaire
from "./pages/faculty/FacultyQuestionnaire";

import SubmissionStatus
from "./pages/faculty/SubmissionStatus";

import HodDashboard
from "./pages/hod/HodDashboard";

import FacultyReview from "./pages/hod/FacultyReview";
import ApprovedReviews from "./pages/hod/ApprovedReviews";
import RejectedReviews from "./pages/hod/RejectedReviews";

import DeanDashboard
from "./pages/dean/DeanDashboard";

import AdminDashboard
from "./pages/admin/AdminDashboard";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/faculty/dashboard"
        element={
          <FacultyDashboard />
        }
      />

      <Route
        path="/faculty/questionnaire"
        element={
          <FacultyQuestionnaire />
        }
      />

      {/* EDIT MODE */}

      <Route
        path="/faculty/questionnaire/:id"
        element={
          <FacultyQuestionnaire />
        }
      />

      <Route
        path="/faculty/submissions"
        element={
          <SubmissionStatus />
        }
      />

      <Route
        path="/hod/dashboard"
        element={
          <HodDashboard />
        }
      />

      <Route
  path="/hod/faculty-review"
  element={<FacultyReview />}
/>

<Route
  path="/hod/approved-reviews"
  element={<ApprovedReviews />}
/>

<Route
  path="/hod/rejected-reviews"
  element={<RejectedReviews />}
/>

      <Route
        path="/dean/dashboard"
        element={
          <DeanDashboard />
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminDashboard />
        }
      />

    </Routes>

  );

}

export default App;