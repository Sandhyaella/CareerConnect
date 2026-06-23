import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { uploadResume } from "../../services/authService";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const ResumeUpload = ({ embedded = false }) => {
  const { user, setUser } = useAuth();
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Select a PDF file first");
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const data = await uploadResume(formData, (evt) => setProgress(Math.round((evt.loaded * 100) / evt.total)));
      setUser((prev) => ({ ...prev, resume: data.resume }));
      toast.success("Resume uploaded successfully");
      setFile(null);
      setProgress(0);
    } catch (error) {
      toast.error(String(error));
    }
  };

  const content = (
    <>
      <div className="profile-upload-header">
        <div>
          <h3 className="profile-upload-title">PDF Resume</h3>
          <p className="profile-upload-desc">Upload a PDF resume (max file size depends on server settings).</p>
        </div>
        {user?.resume && (
          <a
            className="btn btn-sm btn-outline-primary"
            href={`${baseUrl}${user.resume}`}
            target="_blank"
            rel="noreferrer"
          >
            View Current
          </a>
        )}
      </div>
      <input
        className="form-control mb-3"
        type="file"
        accept=".pdf,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      {progress > 0 && (
        <div className="progress mb-3">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      <button className="btn btn-primary btn-sm" type="submit" disabled={!file}>
        Upload Resume
      </button>
    </>
  );

  if (embedded) {
    return <form onSubmit={submit} className="profile-upload-block">{content}</form>;
  }

  return (
    <form onSubmit={submit} className="card p-3">
      {content}
    </form>
  );
};

export default ResumeUpload;
