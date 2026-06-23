import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";
import { useAuth } from "../../context/AuthContext";

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const { socket } = useAuth();

  const loadApps = () => getMyApplications().then(setApps).catch(() => setApps([]));

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onStatus = () => loadApps();
    socket.on("application:statusUpdated", onStatus);
    return () => socket.off("application:statusUpdated", onStatus);
  }, [socket]);

  return (
    <div className="container py-4">
      <h3>My Applications</h3>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>Job</th><th>Company</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{apps.map((a) => <tr key={a._id}><td>{a.job?.title}</td><td>{a.job?.company}</td><td>{new Date(a.appliedAt).toLocaleDateString()}</td><td><span className="badge text-bg-info">{a.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApplications;
