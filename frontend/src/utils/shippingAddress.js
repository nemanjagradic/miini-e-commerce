export const COUNTRY_OPTIONS = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
];

const US_STATE_RE = /^[A-Za-z]{2}$/;
const CA_PROVINCE_RE = /^[A-Za-z]{2}$/;
const NAME_RE = /^[A-Za-zÀ-ÿ' -]{3,80}$/;
const CITY_RE = /^[A-Za-zÀ-ÿ' .-]{3,80}$/;
const US_ZIP_RE = /^\d{5}(-\d{4})?$/;
const CA_POSTAL_RE = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;

export const emptyShippingAddress = () => ({
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
});

export const digitsOnly = (value) => String(value || "").replace(/\D/g, "");

export const normalizePhone = (value) => {
  let digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
};

export const normalizePostalCodeInput = (value, country) => {
  const raw = String(value || "").toUpperCase();
  if (country === "CA") {
    // Canadian postal: letters + digits + optional space
    const cleaned = raw.replace(/[^A-Z0-9 ]/g, "").replace(/\s+/g, " ");
    return cleaned.slice(0, 7);
  }
  // US ZIP: digits and one hyphen
  let out = "";
  for (const ch of raw) {
    if (/\d/.test(ch)) out += ch;
    else if (ch === "-" && out.length === 5 && !out.includes("-")) out += "-";
  }
  if (out.includes("-")) {
    const [left, right = ""] = out.split("-");
    return `${left.slice(0, 5)}-${right.replace(/\D/g, "").slice(0, 4)}`;
  }
  return out.slice(0, 5);
};

export const normalizePostalCode = (value, country) => {
  const raw = String(value || "").trim().toUpperCase();
  if (country === "CA") {
    const compact = raw.replace(/[^A-Z0-9]/g, "");
    if (compact.length === 6) {
      return `${compact.slice(0, 3)} ${compact.slice(3)}`;
    }
    return compact;
  }
  const digits = digitsOnly(raw);
  if (digits.length === 9) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits.slice(0, 5);
};

export const normalizeShippingAddress = (raw = {}) => {
  const country = raw.country === "CA" ? "CA" : "US";
  return {
    fullName: String(raw.fullName || "").trim().replace(/\s+/g, " "),
    phone: normalizePhone(raw.phone),
    line1: String(raw.line1 || "").trim(),
    line2: String(raw.line2 || "").trim(),
    city: String(raw.city || "").trim().replace(/\s+/g, " "),
    state: String(raw.state || "")
      .trim()
      .toUpperCase()
      .slice(0, 2),
    postalCode: normalizePostalCode(raw.postalCode, country),
    country,
  };
};

/** Prefill recipient name from account name only when shipping fullName is empty. */
export const withDefaultFullName = (raw, accountName) => {
  const addr = normalizeShippingAddress(raw || emptyShippingAddress());
  if (!addr.fullName && accountName) {
    addr.fullName = String(accountName).trim().replace(/\s+/g, " ");
  }
  return addr;
};

/** @returns {Record<string, string>|null} field errors, or null if valid */
export const validateShippingAddressClient = (raw) => {
  const a = normalizeShippingAddress(raw);
  const errors = {};

  if (!a.fullName) errors.fullName = "Full name is required.";
  else if (!NAME_RE.test(a.fullName)) {
    errors.fullName = "Enter a valid full name.";
  }

  if (!a.phone) errors.phone = "Phone is required.";
  else if (!/^\d{10}$/.test(a.phone)) {
    errors.phone = "Enter a 10-digit phone number.";
  }

  if (!a.line1) errors.line1 = "Address is required.";
  else if (a.line1.length < 5 || a.line1.length > 100) {
    errors.line1 = "Enter a complete street address.";
  }

  if (a.line2.length > 100) {
    errors.line2 = "Address line 2 is too long.";
  }

  if (!a.city) errors.city = "City is required.";
  else if (!CITY_RE.test(a.city)) {
    errors.city = "Enter a valid city name.";
  }

  if (!a.state) {
    errors.state =
      a.country === "CA" ? "Province is required." : "State is required.";
  } else if (a.country === "US" && !US_STATE_RE.test(a.state)) {
    errors.state = "Use a 2-letter state code.";
  } else if (a.country === "CA" && !CA_PROVINCE_RE.test(a.state)) {
    errors.state = "Use a 2-letter province code.";
  }

  if (!a.postalCode) {
    errors.postalCode =
      a.country === "CA" ? "Postal code is required." : "ZIP code is required.";
  } else if (a.country === "US" && !US_ZIP_RE.test(a.postalCode)) {
    errors.postalCode = "Enter a valid ZIP code.";
  } else if (a.country === "CA" && !CA_POSTAL_RE.test(a.postalCode)) {
    errors.postalCode = "Enter a valid postal code.";
  }

  return Object.keys(errors).length ? errors : null;
};

export const isCompleteShippingAddress = (addr) => {
  if (!addr || typeof addr !== "object") return false;
  return validateShippingAddressClient(addr) === null;
};

export const formatShippingAddress = (raw) => {
  if (!raw) return "";
  const a = normalizeShippingAddress(raw);
  if (!a.fullName && !a.line1) return "";
  const countryLabel = a.country === "CA" ? "Canada" : "United States";
  return [
    a.fullName,
    a.phone,
    a.line1,
    a.line2,
    [a.city, a.state, a.postalCode].filter(Boolean).join(", "),
    countryLabel,
  ]
    .filter(Boolean)
    .join("\n");
};

export const isBlankShippingAddress = (addr) => {
  const a = normalizeShippingAddress(addr || {});
  // fullName alone (e.g. prefilled from account name) does not count as a saved address
  return !(a.phone || a.line1 || a.line2 || a.city || a.state || a.postalCode);
};

export const addressesEqual = (a, b) => {
  const x = normalizeShippingAddress(a || {});
  const y = normalizeShippingAddress(b || {});
  return (
    x.fullName === y.fullName &&
    x.phone === y.phone &&
    x.line1 === y.line1 &&
    x.line2 === y.line2 &&
    x.city === y.city &&
    x.state === y.state &&
    x.postalCode === y.postalCode &&
    x.country === y.country
  );
};
