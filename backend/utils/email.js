require("@babel/register")({ extensions: [".js", ".jsx"] });
const sgMail = require("@sendgrid/mail");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const htmlToText = require("html-to-text");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
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

    const msg = {
      to: this.to,
      from: this.from,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await sgMail.send(msg);
  }

  async sendWelcome() {
    await this.send("welcomeEmail", "Welcome to Miini!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordResetEmail",
      "Your password reset token (valid for 10 minutes)"
    );
  }
}

module.exports = Email;
