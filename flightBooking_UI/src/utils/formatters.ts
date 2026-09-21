export function formatDate(dateTime: string) {
  return new Date(dateTime).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatPrice(price: number): string {
  // The database stores prices in USD; convert to SEK before formatting.
  const SEK_PER_USD = 10.5
  const priceInSek = price * SEK_PER_USD

  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(priceInSek)
}
 