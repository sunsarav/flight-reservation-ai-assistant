import type { FormEvent } from 'react'
import { Loader2, Search, Trash2 } from 'lucide-react'
 
interface CancelForm {
  flightId: string
  email: string
}
 
interface BookingToolsProps {
  cancelForm: CancelForm
  lookupEmail: string
  working: boolean
  onCancelFormChange: (cancelForm: CancelForm) => void
  onLookupEmailChange: (email: string) => void
  onCancelSubmit: (event: FormEvent<HTMLFormElement>) => void
  onLookupSubmit: (event: FormEvent<HTMLFormElement>) => void
}
 
function BookingTools({
  cancelForm,
  lookupEmail,
  working,
  onCancelFormChange,
  onLookupEmailChange,
  onCancelSubmit,
  onLookupSubmit,
}: BookingToolsProps) {
  return (
    <section className="booking-tools">
      <form className="tool-panel" onSubmit={onLookupSubmit}>
        <div className="panel-heading">
          <Search size={20} />
          <h2>Find Bookings</h2>
        </div>
        <label>
          Passenger email
          <input
            type="email"
            value={lookupEmail}
            onChange={(event) => onLookupEmailChange(event.target.value)}
            placeholder="jane@example.com"
            required
          />
        </label>
        <button type="submit" disabled={working}>
          {working ? <Loader2 className="spin" size={18} /> : <Search size={18} />}
          Search
        </button>
      </form>
 
      <form className="tool-panel" onSubmit={onCancelSubmit}>
        <div className="panel-heading">
          <Trash2 size={20} />
          <h2>Cancel Booking</h2>
        </div>
        <label>
          Flight ID
          <input
            type="number"
            min="1"
            value={cancelForm.flightId}
            onChange={(event) =>
              onCancelFormChange({
                ...cancelForm,
                flightId: event.target.value,
              })
            }
            placeholder="1"
            required
          />
        </label>
        <label>
          Passenger email
          <input
            type="email"
            value={cancelForm.email}
            onChange={(event) =>
              onCancelFormChange({
                ...cancelForm,
                email: event.target.value,
              })
            }
            placeholder="jane@example.com"
            required
          />
        </label>
        <button className="danger-button" type="submit" disabled={working}>
          {working ? <Loader2 className="spin" size={18} /> : <Trash2 size={18} />}
          Cancel
        </button>
      </form>
    </section>
  )
}
 
export type { CancelForm }
export default BookingTools