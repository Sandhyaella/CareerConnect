import { updateApplicationStatus } from "../../services/recruiterService";

const UpdateApplicationStatus = ({ application, onDone }) => {
  const change = async (status) => {
    await updateApplicationStatus(application._id, status);
    onDone?.();
  };
  return (
    <div className="d-flex gap-2 mt-2">
      {["Pending", "Shortlisted", "Rejected"].map((s) => (
        <button key={s} className="btn btn-sm btn-outline-primary" onClick={() => change(s)}>{s}</button>
      ))}
    </div>
  );
};

export default UpdateApplicationStatus;
