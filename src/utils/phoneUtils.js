export function processPhone(phone, countryCode) {
  console.log("> processPhone called with:", { phone, countryCode });

  if (!phone || !countryCode) return null;

  // Country code with and without +
  const cc = countryCode.replace(/\D/g, ""); // e.g. "91", "1", "44"

  // Clean phone
  let cleaned = phone.replace(/[\s\-()+]/g, "");

  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, "");

  // Remove country code if user entered full number
  if (cleaned.startsWith(cc)) {
    cleaned = cleaned.slice(cc.length);
  }

  return {
    localPhone: cleaned,
    whatsappPhone:
      cc === "91"
        ? `${cc}${cleaned}`      // India -> 919876543210
        : `+${cc}${cleaned}`,    // Others -> +12816383743
  };
}