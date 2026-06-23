import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { uploadVideoResume } from "../../services/authService";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const VideoResumeUpload = ({ embedded = false }) => {
  const { user, setUser } = useAuth();
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Select a video file first");
    const formData = new FormData();
    formData.append("videoResume", file);
    try {
      const data = await uploadVideoResume(formData, (evt) =>
        setProgress(Math.round((evt.loaded * 100) / evt.total))
      );
      setUser((prev) => ({ ...prev, videoResume: data.videoResume }));
      toast.success("Video resume uploaded successfully");
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
          <h3 className="profile-upload-title">Video Resume</h3>
          <p className="profile-upload-desc">
            Upload a short introduction video (MP4, WebM, or MOV, max 50 MB).
          </p>
        </div>
      </div>
      {user?.videoResume && (
        <video
          className="profile-video-preview w-100 mb-3"
          controls
          src={`${baseUrl}${user.videoResume}`}
        />
      )}
      <input
        className="form-control mb-3"
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      {progress > 0 && (
        <div className="progress mb-3">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      <button className="btn btn-primary btn-sm" type="submit" disabled={!file}>
        Upload Video Resume
      </button>
    </>
  );

  if (embedded) {
    return <form onSubmit={submit} className="profile-upload-block">{content}</form>;
  }

  return (
    <form onSubmit={submit} className="card p-3 mt-3">
      {content}
    </form>
  );
};

export default VideoResumeUpload;
