const Pagination = ({ page, pages, onPage }) => (
  <div className="d-flex justify-content-center gap-2 mt-4">
    <button className="btn btn-outline-primary" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</button>
    <span className="align-self-center">Page {page} / {pages || 1}</span>
    <button className="btn btn-outline-primary" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
  </div>
);

export default Pagination;
