export function parseApiErrors(
  data,
  setErrorFn,
  prefix = "Validation failed:",
) {
  if (typeof data.message === "string") {
    const messages = data.message
      .replace(prefix, "")
      .split(",")
      .map((msg) =>
        msg.includes(":")
          ? msg.split(":").slice(1).join(":").trim()
          : msg.trim(),
      );
    setErrorFn(messages);
  } else if (Array.isArray(data.message)) {
    setErrorFn(data.message);
  } else {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
}
