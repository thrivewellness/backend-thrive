export function processPhone(phone, countryCode) {
  if (!phone || !countryCode) return null;

  // Normalize country code → remove +
  const cc = countryCode.replace(/\D/g, "");

  // Remove spaces, +, -, brackets from phone
  let cleaned = phone.replace(/[\s\-()+]/g, "");

  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, "");

  // If user pasted full number with country code, strip it
  if (cleaned.startsWith(cc)) {
    cleaned = cleaned.slice(cc.length);
  }

  return {
    localPhone: cleaned,              // DB → only local number
    whatsappPhone: `${cc}${cleaned}`, // WA → full E.164 without +
  };
}
