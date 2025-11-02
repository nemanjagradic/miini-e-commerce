require("@babel/register")({
  extensions: [".js", ".jsx"],
});

const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

class Email {
  constructor(user, url) {
    this.from = process.env.EMAIL_FROM;
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        // tls: {
        //   rejectUnauthorized: false,
        // },
      });
    }

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

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcomeEmail", "Welcome to the Miini!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordResetEmail",
      "Your password reset token (valid only for 10 minutes)"
    );
  }
}

module.exports = Email;
