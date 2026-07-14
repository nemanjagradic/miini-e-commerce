const Modal = ({
  message,
  description,
  cancelOrder = false,
  cancelMessage,
  confirmMessage,
  handleCancel,
  handleConfirm,
  confirmVariant = "danger",
}) => {
  const confirmClass =
    confirmVariant === "neutral"
      ? "rounded-lg bg-lightBlack px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
      : "rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg font-Heebo">
        <h4 className="mb-2 text-lg font-semibold text-lightBlack">{message}</h4>
        {(description || cancelOrder) && (
          <p className="mb-6 text-sm text-gray-600">
            {description || "This action cannot be undone."}
          </p>
        )}
        <div className={`flex justify-end gap-3 ${!(description || cancelOrder) ? "mt-4" : ""}`}>
          <button
            type="button"
            onClick={() => handleCancel()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-lightBlack"
          >
            {cancelMessage}
          </button>
          <button
            type="button"
            onClick={() => handleConfirm()}
            className={confirmClass}
          >
            {confirmMessage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
