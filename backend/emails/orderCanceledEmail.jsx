const React = require("react");

const OrderCanceledEmail = ({ firstName, subject, order }) => {
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
        Your order <strong>#{order?.id?.slice?.(-6) || order?.id}</strong> has
        been canceled.
      </p>
      <p>
        If you didn&apos;t request this or have questions, just reply to this
        email.
      </p>
      <p>– The Miini Team</p>
    </div>
  );
};

module.exports = OrderCanceledEmail;
