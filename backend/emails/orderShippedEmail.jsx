const React = require("react");

const OrderShippedEmail = ({ firstName, subject, order }) => {
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
        Good news — your order{" "}
        <strong>#{order?.id?.slice?.(-6) || order?.id}</strong> is on its way.
      </p>
      {(order?.carrier || order?.trackingNumber) && (
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "8px",
            padding: "16px",
            margin: "20px 0",
          }}
        >
          {order.carrier ? (
            <p style={{ margin: "0 0 8px" }}>
              Carrier: <strong>{order.carrier}</strong>
            </p>
          ) : null}
          {order.trackingNumber ? (
            <p style={{ margin: 0 }}>
              Tracking: <strong>{order.trackingNumber}</strong>
            </p>
          ) : null}
        </div>
      )}
      {order?.shippingAddressFormatted ? (
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "8px",
            padding: "16px",
            margin: "20px 0",
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>Ship to</p>
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>
            {order.shippingAddressFormatted}
          </p>
        </div>
      ) : null}
      <p>You&apos;ll get another email when it&apos;s delivered.</p>
      <p>– The Miini Team</p>
    </div>
  );
};

module.exports = OrderShippedEmail;
