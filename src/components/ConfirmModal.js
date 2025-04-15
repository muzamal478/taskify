const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2 className="text-xl font-semibold mb-4">{message}</h2>
          <div className="flex gap-4">
            <button onClick={onConfirm} className="modal-button btn-primary">
              Confirm
            </button>
            <button onClick={onClose} className="modal-button btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmModal;