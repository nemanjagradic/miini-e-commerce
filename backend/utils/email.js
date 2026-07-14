require("@babel/register")({ extensions: [".js", ".jsx"] });
const { Resend } = require("resend");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const htmlToText = require("html-to-text");

const resend = new Resend(process.env.RESEND_API_KEY);

const ORDER_EMAIL_TEMPLATES = {
  paid: {
    file: "orderPaidEmail",
    subject: (order) =>
      `Payment received — order #${String(order.id).slice(-6)}`,
  },
  shipped: {
    file: "orderShippedEmail",
    subject: (order) => `Your order #${String(order.id).slice(-6)} has shipped`,
  },
  delivered: {
    file: "orderDeliveredEmail",
    subject: (order) =>
      `Delivered — order #${String(order.id).slice(-6)}`,
  },
  canceled: {
    file: "orderCanceledEmail",
    subject: (order) =>
      `Order #${String(order.id).slice(-6)} canceled`,
  },
  refunded: {
    file: "orderRefundedEmail",
    subject: (order) =>
      `Refund issued — order #${String(order.id).slice(-6)}`,
  },
};

const serializeOrderForEmail = (order) => {
  const { formatShippingAddress } = require("./shippingAddress");
  return {
    id: order._id?.toString?.() || String(order.id || order._id),
    products: (order.products || []).map((p) => ({
      title: p.title,
      price: p.price,
      quantity: p.quantity,
    })),
    subtotal: order.subtotal,
    shippingCost: order.shippingCost ?? 0,
    totalPrice: order.totalPrice,
    trackingNumber: order.trackingNumber || "",
    carrier: order.carrier || "",
    status: order.status,
    shippingAddress: order.shippingAddress || null,
    shippingAddressFormatted: formatShippingAddress(order.shippingAddress),
  };
};

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = (user.name || "there").split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  async send(template, subject, extraProps = {}) {
    const templateComponent = require(`../emails/${template}.jsx`);
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(templateComponent, {
        firstName: this.firstName,
        url: this.url,
        subject,
        ...extraProps,
      })
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
      "Your password reset token (valid for 10 minutes)"
    );
  }

  async sendOrderEmail(templateKey, order, extraProps = {}) {
    const config = ORDER_EMAIL_TEMPLATES[templateKey];
    if (!config) {
      throw new Error(`Unknown order email template: ${templateKey}`);
    }

    const payload = serializeOrderForEmail(order);
    const subject = config.subject(payload);
    await this.send(config.file, subject, {
      order: payload,
      refundAmount: order.totalPrice,
      ...extraProps,
    });
  }

  static async sendLowStockAlert({ to, product, threshold }) {
    const templateComponent = require("../emails/lowStockEmail.jsx");
    const subject = `Low stock: ${product.title}`;
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(templateComponent, {
        subject,
        product,
        threshold,
      })
    );

    const recipients = Array.isArray(to) ? to : [to];
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: recipients,
      subject,
      html,
      text: htmlToText.convert(html),
    });
  }
}

Email.ORDER_EMAIL_TEMPLATES = ORDER_EMAIL_TEMPLATES;

module.exports = Email;
