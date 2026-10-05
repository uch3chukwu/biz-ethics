export const whatsappNumber = "2348033883255";

export const createWhatsAppUrl = (message) => {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
};

export const createProductEnquiry = (
  product,
  formattedPrice
) => {
  const productName = product.name?.trim() || "this product";
  const manufacturer = product.manufacturer?.trim();
  const productReference = manufacturer
    ? `${productName} by ${manufacturer}`
    : productName;

  const hasListedPrice =
    product.show_price &&
    product.price !== null &&
    product.price !== undefined &&
    String(product.price).trim() !== "";

  const message = hasListedPrice
    ? `Hello Biz Ethics, I'm interested in ${productReference}, listed at ${formattedPrice}. I'd like to confirm availability.`
    : `Hello Biz Ethics, I'm interested in ${productReference}. I'd like to confirm the price and availability.`;

  return {
    hasListedPrice,
    url: createWhatsAppUrl(message),
  };
};
