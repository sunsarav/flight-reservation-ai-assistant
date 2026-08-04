import {
  Banknote,
  CalendarDays,
  Clock,
  MapPin,
  Plane,
  Ticket,
  UserRound,
} from 'lucide-react'
import type { Booking, Flight } from '../types/Flight'
import { formatDate, formatPrice } from '../utils/formatters'
 
interface FlightCardProps {
  flight: Flight
  booking?: Booking
  selected?: boolean
  onSelect?: (flight: Flight) => void
}
 
function FlightCard({ flight, booking, selected, onSelect }: FlightCardProps) {
  const canBook = flight.status === 'AVAILABLE' && onSelect
 
  return (
    <article className={`flight-card ${selected ? 'selected' : ''}`}>
      <div className="flight-card-header">
        <div className="flight-number">
          <Plane size={20} />
          <h2>{flight.flightNumber}</h2>
        </div>
 
        <span className={`status-badge ${flight.status.toLowerCase()}`}>
          {flight.status}
        </span>
      </div>
 
      <div className="destination">
        <MapPin size={21} />
        <div>
          <span>Destination</span>
          <strong>{flight.destination}</strong>
        </div>
      </div>
 
      <div className="flight-information">
        <div className="information-row">
          <CalendarDays size={19} />
          <div>
            <span>Departure</span>
            <strong>{formatDate(flight.departureTime)}</strong>
          </div>
        </div>
 
        <div className="information-row">
          <Clock size={19} />
          <div>
            <span>Arrival</span>
            <strong>{formatDate(flight.arrivalTime)}</strong>
          </div>
        </div>
 
        {booking ? (
          <div className="information-row">
            <UserRound size={19} />
            <div>
              <span>Passenger</span>
              <strong>{booking.passengerName}</strong>
            </div>
          </div>
        ) : null}
      </div>
 
      <div className="flight-card-footer">
        <div className="price">
          <Banknote size={21} />
          <div>
            <span>Price</span>
            <strong>{formatPrice(flight.price)}</strong>
          </div>
        </div>
 
        {canBook ? (
          <button
            className="icon-button"
            type="button"
            aria-label={`Book flight ${flight.flightNumber}`}
            title={`Book flight ${flight.flightNumber}`}
            onClick={() => onSelect(flight)}
          >
            <Ticket size={18} />
          </button>
        ) : null}
      </div>
    </article>
  )
}
 
export default FlightCard