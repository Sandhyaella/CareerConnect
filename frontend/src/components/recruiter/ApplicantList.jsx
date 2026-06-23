import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicantsByJob } from "../../services/recruiterService";
import { useAuth } from "../../context/AuthContext";
import UpdateApplicationStatus from "./UpdateApplicationStatus";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const ApplicantList = () => {
  const { jobId } = useParams();
  const [list, setList] = useState([]);
  const { socket } = useAuth();
  const refresh = () => getApplicantsByJob(jobId).then(setList).catch(() => setList([]));
  useEffect(() => { refresh(); }, [jobId]);
  useEffect(() => {
    if (!socket) return;
    const onLiveEvent = (payload) => {
      if (!payload?.jobId || payload.jobId === jobId) refresh();
      else refresh();
    };
    socket.on("application:new", onLiveEvent);
    socket.on("application:statusUpdated", onLiveEvent);
    return () => {
      socket.off("application:new", onLiveEvent);
      socket.off("application:statusUpdated", onLiveEvent);
    };
  }, [socket, jobId]);
  return (
    <div className="container py-4">
      <h4>Applicants</h4>
      {list.map((a) => (
        <div className="card p-3 mb-2" key={a._id}>
          <div className="fw-semibold">{a.candidate?.name} ({a.candidate?.email})</div>
          {a.candidate?.skills?.length > 0 && (
            <div className="text-muted small mt-1">Skills: {a.candidate.skills.join(", ")}</div>
          )}
          {a.candidate?.resume && (
            <a
              className="d-inline-block mt-2"
              href={`${baseUrl}${a.candidate.resume}`}
              target="_blank"
              rel="noreferrer"
            >
              View PDF Resume
            </a>
          )}
          {a.candidate?.videoResume && (
            <div className="mt-3">
              <div className="small text-muted mb-1">Video Resume</div>
              <video
                className="w-100 rounded"
                controls
                src={`${baseUrl}${a.candidate.videoResume}`}
                style={{ maxHeight: "320px" }}
              />
            </div>
          )}
          <div className="mt-3">
            <UpdateApplicationStatus application={a} onDone={refresh} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicantList;
