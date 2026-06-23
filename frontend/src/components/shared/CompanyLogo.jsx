const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const CompanyLogo = ({ logo, company, size = 48, className = "" }) => {
  if (logo) {
    return (
      <img
        src={`${baseUrl}${logo}`}
        alt={`${company} logo`}
        className={`company-logo ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div className={`company-logo-fallback ${className}`} style={{ width: size, height: size }}>
      {company?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
};

export default CompanyLogo;
