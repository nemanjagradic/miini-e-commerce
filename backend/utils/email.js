require("@babel/register")({ extensions: [".js", ".jsx"] });
const { Resend } = require("resend");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const htmlToText = require("html-to-text");

const resend = new Resend(process.env.RESEND_API_KEY);

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
      }),
    );

    await resend.emails.send({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    });
  }

  async sendWelcome() {
    await this.send("welcomeEmail", "Welcome to Miini!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordResetEmail",
      "Your password reset token (valid for 10 minutes)",
    );
  }
}

module.exports = Email;
