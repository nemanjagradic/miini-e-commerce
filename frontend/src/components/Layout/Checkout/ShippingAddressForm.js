import {
  COUNTRY_OPTIONS,
  emptyShippingAddress,
  normalizePhone,
  normalizePostalCodeInput,
} from "../../../utils/shippingAddress";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lightBlack focus:outline-none focus:ring-1 focus:ring-lightBlack";

const inputErrorClass =
  "mt-1.5 block w-full rounded-lg border border-red-500 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;

const ShippingAddressForm = ({
  value,
  onChange,
  idPrefix = "ship",
  showSaveToProfile = false,
  saveToProfile = true,
  onSaveToProfileChange,
  requireFields = true,
  errors = {},
  onClearError,
}) => {
  const addr = value || emptyShippingAddress();
  const country = addr.country || "US";

  const setField = (key, fieldValue) => {
    onClearError?.(key);
    onChange({ ...addr, [key]: fieldValue });
  };

  const onPhoneChange = (e) => {
    setField("phone", normalizePhone(e.target.value));
  };

  const onStateChange = (e) => {
    const next = e.target.value
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 2);
    setField("state", next);
  };

  const onPostalChange = (e) => {
    setField(
      "postalCode",
      normalizePostalCodeInput(e.target.value, country)
    );
  };

  const onCountryChange = (e) => {
    const nextCountry = e.target.value;
    onClearError?.("country");
    onClearError?.("postalCode");
    onClearError?.("state");
    onChange({
      ...addr,
      country: nextCountry,
      postalCode: normalizePostalCodeInput(addr.postalCode, nextCountry),
      state: String(addr.state || "")
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase()
        .slice(0, 2),
    });
  };

  const fieldClass = (key) => (errors[key] ? inputErrorClass : inputClass);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-fullName`} className="text-sm">
          Recipient name{requireFields ? " *" : ""}
        </label>
        <input
          id={`${idPrefix}-fullName`}
          type="text"
          autoComplete="name"
          value={addr.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          className={fieldClass("fullName")}
          aria-invalid={Boolean(errors.fullName)}
          maxLength={80}
        />
        <FieldError message={errors.fullName} />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-phone`} className="text-sm">
          Phone{requireFields ? " *" : ""}
        </label>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={addr.phone}
          onChange={onPhoneChange}
          className={fieldClass("phone")}
          aria-invalid={Boolean(errors.phone)}
          maxLength={10}
          placeholder="10-digit number"
        />
        <FieldError message={errors.phone} />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-line1`} className="text-sm">
          Address line 1{requireFields ? " *" : ""}
        </label>
        <input
          id={`${idPrefix}-line1`}
          type="text"
          autoComplete="address-line1"
          value={addr.line1}
          onChange={(e) => setField("line1", e.target.value)}
          className={fieldClass("line1")}
          aria-invalid={Boolean(errors.line1)}
          maxLength={100}
        />
        <FieldError message={errors.line1} />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-line2`} className="text-sm">
          Address line 2
        </label>
        <input
          id={`${idPrefix}-line2`}
          type="text"
          autoComplete="address-line2"
          value={addr.line2}
          onChange={(e) => setField("line2", e.target.value)}
          className={fieldClass("line2")}
          aria-invalid={Boolean(errors.line2)}
          maxLength={100}
        />
        <FieldError message={errors.line2} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-city`} className="text-sm">
            City{requireFields ? " *" : ""}
          </label>
          <input
            id={`${idPrefix}-city`}
            type="text"
            autoComplete="address-level2"
            value={addr.city}
            onChange={(e) => setField("city", e.target.value)}
            className={fieldClass("city")}
            aria-invalid={Boolean(errors.city)}
            maxLength={80}
          />
          <FieldError message={errors.city} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-state`} className="text-sm">
            {country === "CA" ? "Province" : "State"}
            {requireFields ? " *" : ""}
          </label>
          <input
            id={`${idPrefix}-state`}
            type="text"
            autoComplete="address-level1"
            value={addr.state}
            onChange={onStateChange}
            className={fieldClass("state")}
            aria-invalid={Boolean(errors.state)}
            maxLength={2}
            placeholder={country === "CA" ? "e.g. ON" : "e.g. NY"}
          />
          <FieldError message={errors.state} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-postalCode`} className="text-sm">
            {country === "CA" ? "Postal code" : "ZIP code"}
            {requireFields ? " *" : ""}
          </label>
          <input
            id={`${idPrefix}-postalCode`}
            type="text"
            inputMode={country === "US" ? "numeric" : "text"}
            autoComplete="postal-code"
            value={addr.postalCode}
            onChange={onPostalChange}
            className={fieldClass("postalCode")}
            aria-invalid={Boolean(errors.postalCode)}
            maxLength={country === "CA" ? 7 : 10}
            placeholder={country === "CA" ? "A1A 1A1" : "10001"}
          />
          <FieldError message={errors.postalCode} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-country`} className="text-sm">
            Country{requireFields ? " *" : ""}
          </label>
          <select
            id={`${idPrefix}-country`}
            value={country}
            onChange={onCountryChange}
            className={fieldClass("country")}
            aria-invalid={Boolean(errors.country)}
          >
            {COUNTRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.country} />
        </div>
      </div>
      {showSaveToProfile && (
        <label className="flex items-center gap-2 text-sm text-darker/80">
          <input
            type="checkbox"
            checked={saveToProfile}
            onChange={(e) => onSaveToProfileChange?.(e.target.checked)}
            className="rounded border-gray-300"
          />
          Save to my profile
        </label>
      )}
    </div>
  );
};

export default ShippingAddressForm;
