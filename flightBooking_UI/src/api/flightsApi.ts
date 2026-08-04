import type {
  AvailableFlight,
  Booking,
  BookingRequest,
  Flight,
} from '../types/Flight'
 
const FLIGHTS_API = '/api/flights'
 
export async function readError(response: Response) {
  try {
    const data = await response.json()
    return data.detail ?? data.message ?? `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}
 
async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
 
  if (!response.ok) {
    throw new Error(await readError(response))
  }
 
  return response.json() as Promise<T>
}
 
function normalizeAvailableFlights(flights: AvailableFlight[]): Flight[] {
  return flights.map((flight) => ({
    ...flight,
    status: 'AVAILABLE',
  }))
}
 
export async function getAllFlights() {
  return requestJson<Flight[]>(FLIGHTS_API)
}
 
export async function getAvailableFlights() {
  const flights = await requestJson<AvailableFlight[]>(`${FLIGHTS_API}/available`)
  return normalizeAvailableFlights(flights)
}
 
export async function bookFlight(flightId: number, bookingRequest: BookingRequest) {
  return requestJson<Booking>(`${FLIGHTS_API}/${flightId}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingRequest),
  })
}
 
export async function getBookingsByEmail(email: string) {
  const params = new URLSearchParams({ email })
  return requestJson<Booking[]>(`${FLIGHTS_API}/bookings?${params.toString()}`)
}
 
export async function cancelBooking(flightId: string, email: string) {
  const params = new URLSearchParams({ email })
  const response = await fetch(
    `${FLIGHTS_API}/${flightId}/cancel?${params.toString()}`,
    { method: 'DELETE' },
  )
 
  if (!response.ok) {
    throw new Error(await readError(response))
  }
}
 