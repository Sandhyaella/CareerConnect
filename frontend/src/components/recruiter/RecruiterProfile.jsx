import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import ProfileLayout, { ProfileSection } from "../shared/ProfileLayout";
import { updateProfile } from "../../services/authService";

const RecruiterProfile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({ name });
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
      title="Recruiter Profile"
      subtitle="Manage your account details and hiring workspace"
    >
      <div className="row g-4">
        <div className="col-lg-8">
          <ProfileSection
            title="Account Information"
            description="Update how your name appears to candidates across job listings and communications."
          >
            <form onSubmit={save} className="profile-form">
              <div className="mb-3">
                <label className="form-label profile-label" htmlFor="recruiter-name">
                  Full Name
                </label>
                <input
                  id="recruiter-name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label profile-label" htmlFor="recruiter-email">
                  Email Address
                </label>
                <input
                  id="recruiter-email"
                  className="form-control"
                  value={user?.email || ""}
                  disabled
                />
                <div className="form-text">Contact support to change your registered email.</div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </ProfileSection>

          <ProfileSection
            title="Hiring Workspace"
            description="Jump straight into the tools you use to publish roles and review applicants."
          >
            <div className="profile-action-grid">
              <Link to="/recruiter/dashboard" className="profile-action-card">
                <span className="profile-action-title">Dashboard</span>
                <span className="profile-action-desc">View hiring metrics and activity</span>
              </Link>
              <Link to="/recruiter/post-job" className="profile-action-card">
                <span className="profile-action-title">Post a Job</span>
                <span className="profile-action-desc">Create a new opening for candidates</span>
              </Link>
              <Link to="/recruiter/manage-jobs" className="profile-action-card">
                <span className="profile-action-title">Manage Jobs</span>
                <span className="profile-action-desc">Edit listings and review applicants</span>
              </Link>
            </div>
          </ProfileSection>
        </div>

        <div className="col-lg-4">
          <ProfileSection title="Account Summary">
            <div className="profile-stat-list">
              <div className="profile-stat-item">
                <span className="profile-stat-label">Account Type</span>
                <span className="profile-stat-value">Recruiter</span>
              </div>
              <div className="profile-stat-item">
                <span className="profile-stat-label">Display Name</span>
                <span className="profile-stat-value">{name || "Not set"}</span>
              </div>
              <div className="profile-stat-item">
                <span className="profile-stat-label">Email</span>
                <span className="profile-stat-value profile-stat-email">{user?.email}</span>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection title="Professional Tips">
            <ul className="profile-tips">
              <li>Use a clear, professional display name on all job postings.</li>
              <li>Keep job descriptions detailed to attract qualified candidates.</li>
              <li>Review applicants promptly to maintain a strong employer brand.</li>
            </ul>
          </ProfileSection>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default RecruiterProfile;
