const React = require("react");

const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n) || 0);

const OrderPaidEmail = ({ firstName, subject, order }) => {
  const products = order?.products || [];
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
        Thanks for your order! We&apos;ve received your payment and will start
        preparing it shortly.
      </p>
      <p style={{ color: "#555" }}>
        Order <strong>#{order?.id?.slice?.(-6) || order?.id}</strong>
      </p>

      <table
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "20px 0",
        }}
      >
        <thead>
          <tr>
            <th
              align="left"
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
                fontSize: "13px",
              }}
            >
              Item
            </th>
            <th
              align="right"
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
                fontSize: "13px",
              }}
            >
              Qty
            </th>
            <th
              align="right"
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
                fontSize: "13px",
              }}
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                {item.title}
              </td>
              <td
                align="right"
                style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
              >
                {item.quantity}
              </td>
              <td
                align="right"
                style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
              >
                {money(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ margin: "4px 0" }}>
        Subtotal: <strong>{money(order?.subtotal)}</strong>
      </p>
      <p style={{ margin: "4px 0" }}>
        Shipping: <strong>{money(order?.shippingCost)}</strong>
      </p>
      <p style={{ margin: "4px 0", fontSize: "18px" }}>
        Total: <strong>{money(order?.totalPrice)}</strong>
      </p>

      {order?.shippingAddressFormatted ? (
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "8px",
            padding: "16px",
            margin: "24px 0 0",
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>Ship to</p>
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>
            {order.shippingAddressFormatted}
          </p>
        </div>
      ) : null}

      <p style={{ marginTop: "24px" }}>– The Miini Team</p>
    </div>
  );
};

module.exports = OrderPaidEmail;
