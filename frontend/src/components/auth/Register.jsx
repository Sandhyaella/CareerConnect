import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "candidate" });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    try {
      await register(form);
      toast.success("Registration successful");
      navigate(form.role === "recruiter" ? "/recruiter/dashboard" : "/jobs");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div className="container py-5 col-md-6">
      <h2 className="mb-4">Register</h2>
      <form onSubmit={submit} className="card p-4 shadow-sm">
        <input required className="form-control mb-3" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required className="form-control mb-3" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required className="form-control mb-3" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input required className="form-control mb-3" type="password" placeholder="Confirm Password" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        <select className="form-select mb-3" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button className="btn btn-primary">Create Account</button>
        <p className="mt-3 mb-0">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
