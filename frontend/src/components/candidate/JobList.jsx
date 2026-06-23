import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { applyToJob } from "../../services/applicationService";
import { getJobs } from "../../services/jobService";
import FilterPanel from "../shared/FilterPanel";
import LoadingSpinner from "../shared/LoadingSpinner";
import Pagination from "../shared/Pagination";
import SearchBar from "../shared/SearchBar";
import JobCard from "./JobCard";

const JobList = () => {
  const [state, setState] = useState({ jobs: [], page: 1, pages: 1, loading: true, search: "", location: "", category: "", type: "", minSalary: "" });

  const loadJobs = async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const { search, location, category, type, minSalary, page } = state;
      const data = await getJobs({ search, location, category, type, minSalary, page, limit: 6 });
      setState((s) => ({ ...s, jobs: data.jobs, pages: data.pages, loading: false }));
    } catch (error) {
      toast.error(String(error));
      setState((s) => ({ ...s, loading: false }));
    }
  };

  useEffect(() => { loadJobs(); }, [state.page, state.search, state.location, state.category, state.type, state.minSalary]);

  const handleSearch = useCallback((search) => {
    setState((s) => ({ ...s, search, page: 1 }));
  }, []);

  const handleApply = async (jobId) => {
    try {
      await applyToJob(jobId);
      toast.success("Applied successfully");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div className="container py-4">
      <SearchBar value={state.search} onSearch={handleSearch} />
      <div className="my-3"><FilterPanel filters={state} onChange={(k, v) => setState((s) => ({ ...s, [k]: v, page: 1 }))} /></div>
      {state.loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="row g-3">{state.jobs.map((job) => <div key={job._id} className="col-md-6 col-lg-4"><JobCard job={job} onApply={handleApply} /></div>)}</div>
          <Pagination page={state.page} pages={state.pages} onPage={(page) => setState((s) => ({ ...s, page }))} />
        </>
      )}
    </div>
  );
};

export default JobList;
