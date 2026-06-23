import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CandidateProfile from "./components/candidate/CandidateProfile";
import JobDetail from "./components/candidate/JobDetail";
import JobList from "./components/candidate/JobList";
import MyApplications from "./components/candidate/MyApplications";
import ApplicantList from "./components/recruiter/ApplicantList";
import ManageJobs from "./components/recruiter/ManageJobs";
import PostJob from "./components/recruiter/PostJob";
import RecruiterDashboard from "./components/recruiter/RecruiterDashboard";
import RecruiterProfile from "./components/recruiter/RecruiterProfile";
import ChatPage from "./components/shared/ChatPage";
import Footer from "./components/shared/Footer";
import Navbar from "./components/shared/Navbar";
import PostFeed from "./components/shared/PostFeed";
import { useAuth } from "./context/AuthContext";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { user } = useAuth();
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); }, [dark]);
  return (
    <div className="app-shell">
      <Navbar />
      <div className="container py-2 text-end theme-toggle-wrap">
        <button type="button" className="btn btn-sm theme-toggle" onClick={() => setDark((d) => !d)}>
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/posts" element={<PostFeed />} />
        <Route path="/chat" element={<ProtectedRoute roles={["candidate", "recruiter"]}><ChatPage /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/profile" element={<ProtectedRoute roles={["candidate"]}><CandidateProfile /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute roles={["candidate"]}><MyApplications /></ProtectedRoute>} />
        <Route path="/recruiter/dashboard" element={<ProtectedRoute roles={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/profile" element={<ProtectedRoute roles={["recruiter"]}><RecruiterProfile /></ProtectedRoute>} />
        <Route path="/recruiter/post-job" element={<ProtectedRoute roles={["recruiter"]}><PostJob /></ProtectedRoute>} />
        <Route path="/recruiter/manage-jobs" element={<ProtectedRoute roles={["recruiter"]}><ManageJobs /></ProtectedRoute>} />
        <Route path="/recruiter/applicants/:jobId" element={<ProtectedRoute roles={["recruiter"]}><ApplicantList /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={2400} />
    </div>
  );
};

export default App;
