import { Link } from "react-router-dom";
import CompanyLogo from "../shared/CompanyLogo";

const JobCard = ({ job, onApply }) => (
  <div className="card hover-lift h-100 border-0 shadow-sm">
    <div className="card-body">
      <div className="d-flex align-items-start gap-3 mb-3">
        <CompanyLogo logo={job.companyLogo} company={job.company} size={52} />
        <div>
          <h5 className="mb-1">{job.title}</h5>
          <p className="text-muted mb-0">{job.company} · {job.location}</p>
        </div>
      </div>
      <p className="small">{job.description.slice(0, 110)}...</p>
      <div className="d-flex gap-2 flex-wrap mb-3">{job.skills?.map((s) => <span key={s} className="badge text-bg-light border">{s}</span>)}</div>
      <div className="d-flex gap-2">
        <Link to={`/jobs/${job._id}`} className="btn btn-outline-primary btn-sm">Details</Link>
        {onApply && <button className="btn btn-primary btn-sm" onClick={() => onApply(job._id)}>Apply</button>}
      </div>
    </div>
  </div>
);

export default JobCard;
