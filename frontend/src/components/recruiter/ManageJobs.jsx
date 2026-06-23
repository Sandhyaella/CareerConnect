import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteJob } from "../../services/jobService";
import { getRecruiterJobs } from "../../services/recruiterService";
import CompanyLogo from "../shared/CompanyLogo";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const load = () => getRecruiterJobs().then(setJobs).catch(() => setJobs([]));
  useEffect(() => { load(); }, []);
  const remove = async (id) => {
    try {
      await deleteJob(id);
      toast.success("Job deleted");
      load();
    } catch (e) { toast.error(String(e)); }
  };
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Manage Jobs</h4>
        <Link className="btn btn-primary btn-sm" to="/recruiter/post-job">+ Add New Job</Link>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Logo</th>
              <th>Location</th>
              <th>Type</th>
              <th>Applicants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j._id}>
                <td>{j.title}</td>
                <td>{j.company}</td>
                <td><CompanyLogo logo={j.companyLogo} company={j.company} size={36} /></td>
                <td>{j.location}</td>
                <td>{j.type}</td>
                <td>
                  <Link className="btn btn-outline-primary btn-sm" to={`/recruiter/applicants/${j._id}`}>View</Link>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Link className="btn btn-outline-secondary btn-sm" to={`/jobs/${j._id}`}>Details</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(j._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">No jobs posted yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;
