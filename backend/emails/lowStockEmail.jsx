const React = require("react");

const LowStockEmail = ({ subject, product, threshold }) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#333",
      }}
    >
      <h2 style={{ color: "#0f172a" }}>{subject}</h2>
      <p>A product has dropped below the low-stock threshold.</p>
      <div
        style={{
          background: "#f8fafc",
          borderRadius: "8px",
          padding: "16px",
          margin: "20px 0",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>
          <strong>{product?.title}</strong>
        </p>
        <p style={{ margin: "0 0 8px" }}>
          Stock: <strong>{product?.stockQuantity}</strong> (threshold:{" "}
          {threshold})
        </p>
        {product?.slug ? (
          <p style={{ margin: 0, color: "#555" }}>Slug: {product.slug}</p>
        ) : null}
      </div>
      <p>Restock soon to avoid selling out.</p>
      <p>– Miini Admin</p>
    </div>
  );
};

module.exports = LowStockEmail;
