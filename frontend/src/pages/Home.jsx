import { Link } from "react-router-dom";

const Home = () => (
  <>
    <section className="gradient-hero text-white py-5">
      <div className="container py-5">
        <h1 className="display-4 fw-bold">Build your career with CareerConnect</h1>
        <p className="lead">Discover top opportunities and hire quality talent.</p>
        <Link className="btn btn-warning btn-lg" to="/jobs">Explore Jobs</Link>
      </div>
    </section>
    <section className="container py-5">
      <div className="row g-3">
        {["Smart Matching", "Fast Applications", "Recruiter Insights"].map((t) => (
          <div className="col-md-4" key={t}><div className="card p-4 shadow-sm hover-lift h-100"><h5>{t}</h5><p className="mb-0">Modern job portal experience for candidates and recruiters.</p></div></div>
        ))}
      </div>
    </section>
  </>
);

export default Home;
