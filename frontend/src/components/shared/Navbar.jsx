import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-nav shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          CareerConnect
        </Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item"><NavLink className="nav-link" to="/jobs">Jobs</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/posts">Feed</NavLink></li>
            {user && <li className="nav-item"><NavLink className="nav-link" to="/chat">Messages</NavLink></li>}
            {user?.role === "candidate" && <li className="nav-item"><NavLink className="nav-link" to="/my-applications">My Applications</NavLink></li>}
            {user?.role === "recruiter" && <li className="nav-item"><NavLink className="nav-link" to="/recruiter/dashboard">Dashboard</NavLink></li>}
            {user?.role === "recruiter" && <li className="nav-item"><NavLink className="nav-link" to="/recruiter/post-job">Post Job</NavLink></li>}
            {user?.role === "recruiter" && <li className="nav-item"><NavLink className="nav-link" to="/recruiter/manage-jobs">Manage Jobs</NavLink></li>}
            {user?.role === "recruiter" && <li className="nav-item"><NavLink className="nav-link" to="/recruiter/profile">Profile</NavLink></li>}
            {user?.role === "candidate" && <li className="nav-item"><NavLink className="nav-link" to="/profile">Profile</NavLink></li>}
            {!user ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="btn btn-primary" to="/register">Register</NavLink></li>
              </>
            ) : (
              <li className="nav-item"><button className="btn btn-outline-danger" onClick={logout}>Logout</button></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
