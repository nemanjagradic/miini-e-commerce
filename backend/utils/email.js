require("@babel/register")({ extensions: [".js", ".jsx"] });
const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Production SMTP (Gmail or other provider)
      return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
      });
    }

    // Development (Mailtrap)
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    try {
      const templateComponent = require(`../emails/${template}.jsx`);
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(templateComponent, {
          firstName: this.firstName,
          url: this.url,
          subject,
        })
      );

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html),
      };

      const transporter = this.newTransport();
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${this.to}: ${info.response}`);
    } catch (err) {
      console.error(`Error sending email to ${this.to}: ${err.message}`);
    }
  }

  sendWelcome() {
    this.send("welcomeEmail", "Welcome to the Miini!");
  }

  sendPasswordReset() {
    this.send(
      "passwordResetEmail",
      "Your password reset token (valid for 10 minutes)"
    );
  }
}

module.exports = Email;
