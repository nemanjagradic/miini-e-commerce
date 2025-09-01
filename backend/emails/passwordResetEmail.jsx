const React = require("react");

const PasswordResetEmail = ({ firstName, url, subject }) => {
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
        Forgot your password? Submit a <strong>PATCH</strong> request with your
        new password and confirmPassword to the link below:
      </p>

      <p style={{ fontStyle: "italic", color: "#555" }}>
        (Website for this action not yet implemented.)
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
                        Reset your password
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
        If you didn’t forget your password, you can safely ignore this email.
      </p>

      <p>– The Miini Team</p>
    </div>
  );
};

module.exports = PasswordResetEmail;
