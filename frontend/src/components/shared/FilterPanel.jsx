const FilterPanel = ({ filters, onChange }) => (
  <div className="row g-2">
    <div className="col-md-3"><input placeholder="Location" className="form-control" value={filters.location || ""} onChange={(e) => onChange("location", e.target.value)} /></div>
    <div className="col-md-3"><input placeholder="Category" className="form-control" value={filters.category || ""} onChange={(e) => onChange("category", e.target.value)} /></div>
    <div className="col-md-3"><input placeholder="Job Type" className="form-control" value={filters.type || ""} onChange={(e) => onChange("type", e.target.value)} /></div>
    <div className="col-md-3"><input type="number" placeholder="Min Salary" className="form-control" value={filters.minSalary || ""} onChange={(e) => onChange("minSalary", e.target.value)} /></div>
  </div>
);

export default FilterPanel;
