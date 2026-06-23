const ConfirmModal = ({ id, title, body, onConfirm }) => (
  <div className="modal fade" id={id} tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header"><h5 className="modal-title">{title}</h5></div>
        <div className="modal-body">{body}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button className="btn btn-danger" data-bs-dismiss="modal" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
