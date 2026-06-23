import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { applyToJob } from "../../services/applicationService";
import { getJobById } from "../../services/jobService";
import CompanyLogo from "../shared/CompanyLogo";
import LoadingSpinner from "../shared/LoadingSpinner";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    getJobById(id).then(setJob).catch((e) => toast.error(String(e)));
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login as candidate to apply");
      return;
    }
    if (user.role !== "candidate") {
      toast.error("Only candidates can apply to jobs");
      return;
    }
    try {
      setApplying(true);
      await applyToJob(job._id);
      toast.success("Application submitted successfully");
    } catch (error) {
      toast.error(String(error));
    } finally {
      setApplying(false);
    }
  };

  if (!job) return <LoadingSpinner />;
  return (
    <div className="container py-4">
      <div className="card p-4 shadow-sm border-0">
        <div className="d-flex align-items-start gap-3 mb-3">
          <CompanyLogo logo={job.companyLogo} company={job.company} size={72} />
          <div>
            <h2 className="mb-1">{job.title}</h2>
            <p className="text-muted mb-0">{job.company} · {job.location}</p>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="badge text-bg-light border">Category: {job.category}</span>
          <span className="badge text-bg-light border">Type: {job.type}</span>
          <span className="badge text-bg-light border">Salary: ${Number(job.salary).toLocaleString()}</span>
        </div>
        <h6>Job Description</h6>
        <p>{job.description}</p>
        <h6>Required Skills</h6>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {job.skills?.map((skill) => (
            <span key={skill} className="badge rounded-pill text-bg-primary">{skill}</span>
          ))}
          {!job.skills?.length && <span className="text-muted">No specific skills listed.</span>}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" disabled={applying} onClick={handleApply}>
            {applying ? "Applying..." : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
