const Spinner = ({ className = "h-8 w-8" }) => (
  <div
    className={`animate-spin rounded-full border-4 border-gray-300 border-t-lightBlack ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
