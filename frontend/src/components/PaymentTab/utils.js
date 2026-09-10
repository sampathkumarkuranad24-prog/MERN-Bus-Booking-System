const digits = (value = '') => value.replace(/\D/g, '');

export function formatCreditCardNumber(value = '') {
  return digits(value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
export function formatCVC(value = '') {
  return digits(value).slice(0, 3);
}
export function formatExpirationDate(value = '') {
  const v = digits(value).slice(0, 4);
  return v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
}
export function formatFormData(data) {
  return Object.keys(data).map((d) => `${d}: ${data[d]}`);
}
