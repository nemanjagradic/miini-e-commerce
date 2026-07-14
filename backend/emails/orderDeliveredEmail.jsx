const React = require("react");

const OrderDeliveredEmail = ({ firstName, subject, order }) => {
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
        been delivered. We hope you love it!
      </p>
      <p>
        If anything isn&apos;t right, reply to this email and we&apos;ll help.
      </p>
      <p>– The Miini Team</p>
    </div>
  );
};

module.exports = OrderDeliveredEmail;
