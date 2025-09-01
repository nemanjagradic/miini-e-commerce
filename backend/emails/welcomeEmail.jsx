const React = require("react");

const WelcomeEmail = ({ firstName, url, subject }) => {
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
        Welcome to <strong>Miini E-Commerce</strong> – we're excited to have you
        onboard! 🛍️
      </p>

      <p>
        Your account has been successfully created. To make your shopping
        experience even smoother, you can set up your profile and manage your
        preferences.
      </p>

      <table
        role="presentation"
        border="0"
        cellPadding="0"
        cellSpacing="0"
        style={{ margin: "20px 0" }}
      >
        <tbody>
          <tr>
            <td align="left">
              <table
                role="presentation"
                border="0"
                cellPadding="0"
                cellSpacing="0"
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        backgroundColor: "#0f172a",
                        borderRadius: "5px",
                        textAlign: "center",
                      }}
                    >
                      <a
                        href={url}
                        target="_blank"
                        style={{
                          display: "inline-block",
                          padding: "12px 24px",
                          color: "#ffffff",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        Visit Your Account
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        If you ever have questions or need help with your orders, our support
        team is just a click away.
      </p>

      <p>Enjoy shopping! 🛒</p>
      <p>– The Miini Team</p>
    </div>
  );
};

module.exports = WelcomeEmail;
