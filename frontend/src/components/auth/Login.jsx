import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { clearRememberedLogin, getRememberedLogin, saveRememberedLogin } from "../../utils/rememberLogin";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const saved = getRememberedLogin();
    if (saved?.email) {
      setForm({ email: saved.email, password: saved.password || "" });
      setRememberMe(true);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      if (rememberMe) {
        saveRememberedLogin(form.email, form.password);
      } else {
        clearRememberedLogin();
      }
      toast.success("Logged in successfully");
      navigate(data.user.role === "recruiter" ? "/recruiter/dashboard" : "/jobs");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div className="container py-5 col-md-5">
      <h2 className="mb-4">Login</h2>
      <form onSubmit={submit} className="card p-4 shadow-sm">
        <input
          required
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember me
          </label>
        </div>
        <button className="btn btn-primary">Login</button>
        <p className="mt-3 mb-0">No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
