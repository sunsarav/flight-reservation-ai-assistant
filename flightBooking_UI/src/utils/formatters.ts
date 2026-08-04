export function formatDate(dateTime: string) {
  return new Date(dateTime).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
 
export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
 