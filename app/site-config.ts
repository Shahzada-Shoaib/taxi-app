// Add the client's confirmed contact details here. Never use a dummy number.
export const contact = {
  email: "blackcountryminibus@gmail.com",
  mobile: "+44 7735 090685",
  whatsapp: "", // International format, if different from mobile.
  facebook: "", // Full Facebook page URL.
};

export const phoneHref = contact.mobile ? `tel:${contact.mobile.replace(/[^+\d]/g, "")}` : "";
// Temporary testing destination for booking requests only. wa.me needs digits only.
export const bookingWhatsappNumber = "4407735090685";
const whatsappNumber = (contact.whatsapp || contact.mobile).replace(/\D/g, "");
export const whatsappHref = whatsappNumber
  ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello BCM, I'd like to enquire about a journey.")}`
  : "";
