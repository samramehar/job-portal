import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SearchResults from "./components/SearchResults";
import JobSetup from "./components/admin/JobSetup";
import AdminJobDetails from "./components/admin/AdminJobDetails";
import AdminCompanyDetails from "./components/admin/AdminCompanyDetails";
import { Helmet } from "react-helmet-async";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ApplicantProfile from "./components/admin/ApplicantProfile";
import SavedJobs from "./components/SavedJobs.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/saved-jobs",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <SavedJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search-results",
    element: <SearchResults />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["student", "recruiter"]}>
        <>
          <Profile />
          <Helmet>
            <title>CareerLaunch | Profile</title>
          </Helmet>
        </>
      </ProtectedRoute>
    ),
  },

  // Admin / Recruiter routes
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id/edit",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id/details",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <AdminCompanyDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/edit",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <JobSetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/details",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <AdminJobDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/applicant/:id",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <ApplicantProfile />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
