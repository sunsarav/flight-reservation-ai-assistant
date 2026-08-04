import type { Booking } from '../types/Flight'
import FlightCard from './FlightCard'
 
interface BookingResultsProps {
  bookings: Booking[]
}
 
function BookingResults({ bookings }: BookingResultsProps) {
  return (
    <section className="booking-results">
      <h2>Search Results</h2>
      {bookings.length === 0 ? (
        <p className="page-message">Bookings will appear here after a search.</p>
      ) : (
        <section className="flight-grid">
          {bookings.map((booking) => (
            <FlightCard flight={booking} booking={booking} key={booking.id} />
          ))}
        </section>
      )}
    </section>
  )
}
 
export default BookingResults
 