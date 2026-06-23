import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createJob } from "../../services/jobService";
import CompanyLogo from "../shared/CompanyLogo";

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    salary: "",
    location: "",
    category: "",
    type: "Full-time",
    skills: ""
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    setLogoFile(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (Number(form.salary) <= 0) {
      toast.error("Salary must be greater than 0");
      return;
    }
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (logoFile) payload.append("companyLogo", logoFile);
      await createJob(payload);
      toast.success("Job posted");
      navigate("/recruiter/manage-jobs");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div className="container py-4 col-md-8">
      <form className="card p-4" onSubmit={submit}>
        <h4 className="mb-3">Post New Job</h4>
        <input
          required
          className="form-control mb-2"
          placeholder="Job title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <input
          required
          className="form-control mb-2"
          placeholder="Company name"
          value={form.company}
          onChange={(e) => handleChange("company", e.target.value)}
        />
        <div className="mb-3">
          <label className="form-label profile-label">Company Logo</label>
          <div className="d-flex align-items-center gap-3 mb-2">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="company-logo" style={{ width: 56, height: 56 }} />
            ) : (
              <CompanyLogo company={form.company} size={56} />
            )}
            <input
              className="form-control"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleLogoChange}
            />
          </div>
          <div className="form-text">Optional. JPEG, PNG, WebP, or GIF up to 2 MB.</div>
        </div>
        <textarea
          required
          rows={4}
          className="form-control mb-2"
          placeholder="Detailed job description (responsibilities, requirements, perks)"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <input
              required
              type="number"
              min={1}
              className="form-control"
              placeholder="Salary (annual)"
              value={form.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <input
              required
              className="form-control"
              placeholder="Location"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
        </div>
        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <input
              required
              className="form-control"
              placeholder="Category (e.g. Software)"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>
          </div>
        </div>
        <input
          required
          className="form-control mb-3"
          placeholder="Required skills (comma separated)"
          value={form.skills}
          onChange={(e) => handleChange("skills", e.target.value)}
        />
        <button className="btn btn-primary">Publish Job</button>
      </form>
    </div>
  );
};

export default PostJob;
