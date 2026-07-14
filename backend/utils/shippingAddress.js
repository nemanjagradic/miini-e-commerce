const mongoose = require("mongoose");

const ALLOWED_COUNTRIES = ["US", "CA"];

const US_STATE_RE = /^[A-Za-z]{2}$/;
const CA_PROVINCE_RE = /^[A-Za-z]{2}$/;
const NAME_RE = /^[A-Za-zÀ-ÿ' -]{3,80}$/;
const CITY_RE = /^[A-Za-zÀ-ÿ' .-]{3,80}$/;
const US_ZIP_RE = /^\d{5}(-\d{4})?$/;
const CA_POSTAL_RE = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    line1: { type: String, trim: true, default: "" },
    line2: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
    country: {
      type: String,
      enum: ALLOWED_COUNTRIES,
      default: "US",
    },
  },
  { _id: false }
);

const emptyShippingAddress = () => ({
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
});

const digitsOnly = (value) => String(value || "").replace(/\D/g, "");

const normalizePhone = (value) => {
  let digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits;
};

const normalizePostalCode = (value, country) => {
  const raw = String(value || "").trim().toUpperCase();
  if (country === "CA") {
    const compact = raw.replace(/[^A-Z0-9]/g, "");
    if (compact.length === 6) {
      return `${compact.slice(0, 3)} ${compact.slice(3)}`;
    }
    return compact;
  }
  // US: keep digits and a single optional hyphen for ZIP+4
  const digits = digitsOnly(raw);
  if (digits.length === 9) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits.slice(0, 5);
};

const normalizeShippingAddress = (raw = {}) => {
  const country = String(raw.country || "US")
    .trim()
    .toUpperCase();
  const resolvedCountry = ALLOWED_COUNTRIES.includes(country) ? country : "US";
  return {
    fullName: String(raw.fullName || "").trim().replace(/\s+/g, " "),
    phone: normalizePhone(raw.phone),
    line1: String(raw.line1 || "").trim(),
    line2: String(raw.line2 || "").trim(),
    city: String(raw.city || "").trim().replace(/\s+/g, " "),
    state: String(raw.state || "")
      .trim()
      .toUpperCase(),
    postalCode: normalizePostalCode(raw.postalCode, resolvedCountry),
    country: resolvedCountry,
  };
};

const isCompleteShippingAddress = (addr) => {
  if (!addr || typeof addr !== "object") return false;
  try {
    validateShippingAddress(addr);
    return true;
  } catch {
    return false;
  }
};

/**
 * @returns {object} normalized address
 * @throws {Error} with message suitable for AppError 400
 */
const validateShippingAddress = (raw) => {
  if (!raw || typeof raw !== "object") {
    const err = new Error("Shipping address is required.");
    err.statusCode = 400;
    throw err;
  }

  const addr = normalizeShippingAddress(raw);
  const fail = (message) => {
    const err = new Error(message);
    err.statusCode = 400;
    throw err;
  };

  if (!ALLOWED_COUNTRIES.includes(addr.country)) {
    fail("Country must be United States or Canada.");
  }

  if (!addr.fullName) fail("Full name is required.");
  if (!NAME_RE.test(addr.fullName)) {
    fail("Enter a valid full name.");
  }

  if (!addr.phone) fail("Phone is required.");
  if (!/^\d{10}$/.test(addr.phone)) {
    fail("Enter a 10-digit phone number.");
  }

  if (!addr.line1) fail("Address is required.");
  if (addr.line1.length < 5 || addr.line1.length > 100) {
    fail("Enter a complete street address.");
  }

  if (addr.line2.length > 100) {
    fail("Address line 2 is too long.");
  }

  if (!addr.city) fail("City is required.");
  if (!CITY_RE.test(addr.city)) {
    fail("Enter a valid city name.");
  }

  if (!addr.state) {
    fail(addr.country === "CA" ? "Province is required." : "State is required.");
  }
  if (addr.country === "US" && !US_STATE_RE.test(addr.state)) {
    fail("Use a 2-letter state code.");
  }
  if (addr.country === "CA" && !CA_PROVINCE_RE.test(addr.state)) {
    fail("Use a 2-letter province code.");
  }

  if (!addr.postalCode) {
    fail(addr.country === "CA" ? "Postal code is required." : "ZIP code is required.");
  }
  if (addr.country === "US" && !US_ZIP_RE.test(addr.postalCode)) {
    fail("Enter a valid ZIP code.");
  }
  if (addr.country === "CA" && !CA_POSTAL_RE.test(addr.postalCode)) {
    fail("Enter a valid postal code.");
  }

  return addr;
};

const formatShippingAddress = (raw) => {
  if (!raw) return "";
  const a = normalizeShippingAddress(raw || {});
  if (!a.fullName && !a.line1) return "";
  const countryLabel = a.country === "CA" ? "Canada" : "United States";
  const lines = [
    a.fullName,
    a.phone,
    a.line1,
    a.line2,
    [a.city, a.state, a.postalCode].filter(Boolean).join(", "),
    countryLabel,
  ].filter(Boolean);
  return lines.join("\n");
};

const toStripeShipping = (addr) => {
  const a = normalizeShippingAddress(addr);
  return {
    name: a.fullName,
    address: {
      line1: a.line1,
      line2: a.line2 || undefined,
      city: a.city,
      state: a.state,
      postal_code: a.postalCode,
      country: a.country,
    },
  };
};

module.exports = {
  ALLOWED_COUNTRIES,
  shippingAddressSchema,
  emptyShippingAddress,
  normalizeShippingAddress,
  normalizePhone,
  normalizePostalCode,
  digitsOnly,
  isCompleteShippingAddress,
  validateShippingAddress,
  formatShippingAddress,
  toStripeShipping,
};
