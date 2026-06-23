const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

const formatMemberSince = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const roleLabels = {
  candidate: "Candidate",
  recruiter: "Recruiter"
};

const ProfileLayout = ({ user, title, subtitle, children }) => {
  const memberSince = formatMemberSince(user?.createdAt);

  return (
    <div className="container py-4 profile-page">
      <div className="profile-hero card border-0 mb-4">
        <div className="profile-hero-body">
          <div className="profile-avatar" aria-hidden="true">
            {getInitials(user?.name)}
          </div>
          <div className="profile-hero-content">
            <span className={`profile-role-badge profile-role-${user?.role}`}>
              {roleLabels[user?.role] || user?.role}
            </span>
            <h1 className="profile-title">{title}</h1>
            <p className="profile-subtitle">{subtitle || user?.email}</p>
            <div className="profile-meta">
              <span>{user?.name}</span>
              {memberSince && <span>Member since {memberSince}</span>}
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export const ProfileSection = ({ title, description, children, action }) => (
  <section className="profile-section card border-0">
    <div className="profile-section-header">
      <div>
        <h2 className="profile-section-title">{title}</h2>
        {description && <p className="profile-section-desc">{description}</p>}
      </div>
      {action}
    </div>
    <div className="profile-section-body">{children}</div>
  </section>
);

export default ProfileLayout;
