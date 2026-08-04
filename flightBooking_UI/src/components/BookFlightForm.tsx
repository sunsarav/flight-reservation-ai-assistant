import type { FormEvent } from 'react'
import { Loader2, Ticket } from 'lucide-react'
import type { BookingRequest, Flight } from '../types/Flight'
 
interface BookFlightFormProps {
  bookingForm: BookingRequest
  selectedFlight: Flight | null
  working: boolean
  onBookingFormChange: (bookingForm: BookingRequest) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}
 
function BookFlightForm({
  bookingForm,
  selectedFlight,
  working,
  onBookingFormChange,
  onSubmit,
}: BookFlightFormProps) {
  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <div className="panel-heading">
        <Ticket size={20} />
        <h2>Book Flight</h2>
      </div>
 
      <div className="selected-flight">
        <span>Selected flight</span>
        <strong>
          {selectedFlight
            ? `${selectedFlight.flightNumber} to ${selectedFlight.destination}`
            : 'Choose an available flight'}
        </strong>
      </div>
 
      <label>
        Passenger name
        <input
          type="text"
          minLength={2}
          maxLength={100}
          value={bookingForm.passengerName}
          onChange={(event) =>
            onBookingFormChange({
              ...bookingForm,
              passengerName: event.target.value,
            })
          }
          placeholder="Jane Doe"
          required
        />
      </label>
 
      <label>
        Passenger email
        <input
          type="email"
          value={bookingForm.passengerEmail}
          onChange={(event) =>
            onBookingFormChange({
              ...bookingForm,
              passengerEmail: event.target.value,
            })
          }
          placeholder="jane@example.com"
          required
        />
      </label>
 
      <button type="submit" disabled={!selectedFlight || working}>
        {working ? <Loader2 className="spin" size={18} /> : <Ticket size={18} />}
        Book flight
      </button>
    </form>
  )
}
 
export default BookFlightForm
 