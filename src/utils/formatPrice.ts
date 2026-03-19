export function formatPrice(price: number): string {
  // Format like live site: "4.590.000 VND"
  return new Intl.NumberFormat('de-DE').format(price) + ' VND';
}
