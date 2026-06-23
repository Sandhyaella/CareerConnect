import { useEffect, useState } from "react";
import { getDashboard } from "../../services/recruiterService";
import { useAuth } from "../../context/AuthContext";

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, pendingApplications: 0, shortlistedCandidates: 0 });
  const { socket } = useAuth();
  const loadDashboard = () => getDashboard().then(setStats).catch(() => {});

  useEffect(() => { loadDashboard(); }, []);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => loadDashboard();
    socket.on("application:new", refresh);
    socket.on("application:statusUpdated", refresh);
    return () => {
      socket.off("application:new", refresh);
      socket.off("application:statusUpdated", refresh);
    };
  }, [socket]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Recruiter Dashboard</h3>
      <div className="row g-3">
        {Object.entries(stats).map(([k, v]) => (
          <div className="col-md-3" key={k}><div className="card p-3 shadow-sm hover-lift"><h6>{k}</h6><h3>{v}</h3></div></div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
