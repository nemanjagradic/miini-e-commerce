const React = require("react");

const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n) || 0);

const OrderRefundedEmail = ({ firstName, subject, order, refundAmount }) => {
  const amount = refundAmount ?? order?.totalPrice;
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#333",
      }}
    >
      <h2 style={{ color: "#0f172a" }}>{subject}</h2>
      <p>Hi {firstName},</p>
      <p>
        We&apos;ve issued a full refund for order{" "}
        <strong>#{order?.id?.slice?.(-6) || order?.id}</strong>.
      </p>
      <p style={{ fontSize: "18px", margin: "20px 0" }}>
        Refunded amount: <strong>{money(amount)}</strong>
      </p>
      <p>
        Depending on your bank, it may take a few business days to appear on
        your statement.
      </p>
      <p>– The Miini Team</p>
    </div>
  );
};

module.exports = OrderRefundedEmail;
