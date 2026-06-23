import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import ProfileLayout, { ProfileSection } from "../shared/ProfileLayout";
import { updateProfile } from "../../services/authService";
import ResumeUpload from "./ResumeUpload";
import VideoResumeUpload from "./VideoResumeUpload";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const parseSkills = (value) =>
  value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

const CandidateProfile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [saving, setSaving] = useState(false);

  const skillTags = useMemo(() => parseSkills(skills), [skills]);
  const profileComplete = [name, user?.resume, skillTags.length > 0].filter(Boolean).length;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({ name, skills });
      setUser((prev) => ({ ...prev, ...updated }));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(String(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileLayout
      user={user}
      title="My Profile"
      subtitle="Manage your professional details and application materials"
    >
      <div className="row g-4">
        <div className="col-lg-8">
          <ProfileSection
            title="Personal Information"
            description="Keep your name and skills up to date so recruiters can find the right match."
          >
            <form onSubmit={save} className="profile-form">
              <div className="mb-3">
                <label className="form-label profile-label" htmlFor="profile-name">
                  Full Name
                </label>
                <input
                  id="profile-name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label profile-label" htmlFor="profile-email">
                  Email Address
                </label>
                <input
                  id="profile-email"
                  className="form-control"
                  value={user?.email || ""}
                  disabled
                />
                <div className="form-text">Your login email cannot be changed here.</div>
              </div>
              <div className="mb-3">
                <label className="form-label profile-label" htmlFor="profile-skills">
                  Skills
                </label>
                <input
                  id="profile-skills"
                  className="form-control"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                />
                <div className="form-text">Separate skills with commas.</div>
                {skillTags.length > 0 && (
                  <div className="profile-skill-tags mt-3">
                    {skillTags.map((skill) => (
                      <span key={skill} className="badge text-bg-light">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </ProfileSection>

          <ProfileSection
            title="Documents & Media"
            description="Upload your resume and a short video introduction for recruiters."
          >
            <ResumeUpload embedded />
            <VideoResumeUpload embedded />
          </ProfileSection>
        </div>

        <div className="col-lg-4">
          <ProfileSection title="Profile Overview">
            <div className="profile-stat-list">
              <div className="profile-stat-item">
                <span className="profile-stat-label">Account Type</span>
                <span className="profile-stat-value">Candidate</span>
              </div>
              <div className="profile-stat-item">
                <span className="profile-stat-label">Skills Listed</span>
                <span className="profile-stat-value">{skillTags.length || "None yet"}</span>
              </div>
              <div className="profile-stat-item">
                <span className="profile-stat-label">PDF Resume</span>
                <span className="profile-stat-value">{user?.resume ? "Uploaded" : "Not uploaded"}</span>
              </div>
              <div className="profile-stat-item">
                <span className="profile-stat-label">Video Resume</span>
                <span className="profile-stat-value">{user?.videoResume ? "Uploaded" : "Not uploaded"}</span>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection title="Profile Strength">
            <div className="profile-strength">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="profile-strength-label">{profileComplete} of 3 essentials complete</span>
                <span className="profile-strength-percent">{Math.round((profileComplete / 3) * 100)}%</span>
              </div>
              <div className="progress mb-3">
                <div
                  className="progress-bar"
                  style={{ width: `${(profileComplete / 3) * 100}%` }}
                />
              </div>
              <ul className="profile-checklist">
                <li className={name ? "done" : ""}>Add your full name</li>
                <li className={skillTags.length ? "done" : ""}>List at least one skill</li>
                <li className={user?.resume ? "done" : ""}>Upload a PDF resume</li>
              </ul>
            </div>
          </ProfileSection>

          {user?.resume && (
            <ProfileSection title="Current Resume">
              <a
                className="btn btn-outline-primary w-100"
                href={`${baseUrl}${user.resume}`}
                target="_blank"
                rel="noreferrer"
              >
                Download PDF Resume
              </a>
            </ProfileSection>
          )}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default CandidateProfile;
