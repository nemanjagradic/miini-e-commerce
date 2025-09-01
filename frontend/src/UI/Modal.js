const Modal = ({
  message,
  cancelOrder = false,
  cancelMessage,
  confirmMessage,
  handleCancel,
  handleConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
        <h4 className="mb-4 text-lg font-semibold">{message}</h4>
        {cancelOrder && (
          <p className="mb-6 text-sm text-gray-600">
            This action cannot be undone.
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => handleCancel()}
            className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            {cancelMessage}
          </button>
          <button
            onClick={() => handleConfirm()}
            className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            {confirmMessage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
