import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  bookFlight,
  cancelBooking,
  getAllFlights,
  getAvailableFlights,
  getBookingsByEmail,
} from '../api/flightsApi'
import BookingResults from '../components/BookingResults'
import BookingTools from '../components/BookingTools'
import type { CancelForm } from '../components/BookingTools'
import BookFlightForm from '../components/BookFlightForm'
import FlightGrid from '../components/FlightGrid'
import FlightSummary from '../components/FlightSummary'
import PageHeader from '../components/PageHeader'
import StatusMessage from '../components/StatusMessage'
import type { ApiMessage } from '../components/StatusMessage'
import type { Booking, BookingRequest, Flight } from '../types/Flight'
import './AllFlightsPage.css'
 
type ViewMode = 'all' | 'available' | 'bookings'
 
interface AllFlightsPageProps {
  view: ViewMode
}
 
function getHeading(view: ViewMode) {
  if (view === 'available') {
    return 'Available Flights'
  }
 
  if (view === 'bookings') {
    return 'Booking Lookup'
  }
 
  return 'All Flights'
}
 
function getDescription(view: ViewMode) {
  if (view === 'bookings') {
    return 'Search passenger bookings and cancel reservations.'
  }
 
  return 'Browse flights, choose an available seat, and confirm a booking.'
}
 
function AllFlightsPage({ view }: AllFlightsPageProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [bookingForm, setBookingForm] = useState<BookingRequest>({
    passengerName: '',
    passengerEmail: '',
  })
  const [lookupEmail, setLookupEmail] = useState('')
  const [cancelForm, setCancelForm] = useState<CancelForm>({
    flightId: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState<ApiMessage>(null)
 
  const isBookingView = view === 'bookings'
 
  const loadFlights = useCallback(async () => {
    setLoading(true)
     
    try {
      const data = view === 'available' ? await getAvailableFlights() : await getAllFlights()
      setFlights(data)
    } catch (error) {
      const text =
        error instanceof Error ? error.message : 'Unable to load flights'
      setMessage({ type: 'error', text })
    } finally {
      setLoading(false)
    }
  }, [view])
 
  useEffect(() => {
    setSelectedFlight(null)
    setBookings([])
    void loadFlights()
  }, [loadFlights])
 
  const availableCount = useMemo(
    () => flights.filter((flight) => flight.status === 'AVAILABLE').length,
    [flights],
  )
 
  async function handleBookFlight(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    if (!selectedFlight) {
      setMessage({ type: 'error', text: 'Choose an available flight first.' })
      return
    }
 
    setWorking(true)
    setMessage(null)
 
    try {
      const bookedFlight = await bookFlight(selectedFlight.id, bookingForm)
 
      setMessage({
        type: 'success',
        text: `${bookedFlight.flightNumber} is booked for ${bookedFlight.passengerName}.`,
      })
      setBookingForm({ passengerName: '', passengerEmail: '' })
      setSelectedFlight(null)
      await loadFlights()
    } catch (error) {
      const text =
        error instanceof Error ? error.message : 'Unable to book this flight'
      setMessage({ type: 'error', text })
    } finally {
      setWorking(false)
    }
  }
 
  async function handleLookupBookings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setWorking(true)
    setMessage(null)
 
    try {
      const data = await getBookingsByEmail(lookupEmail)
 
      setBookings(data)
      setMessage({
        type: 'success',
        text:
          data.length === 0
            ? 'No active bookings found for that email.'
            : `Found ${data.length} active booking${data.length === 1 ? '' : 's'}.`,
      })
    } catch (error) {
      const text =
        error instanceof Error ? error.message : 'Unable to find bookings'
      setMessage({ type: 'error', text })
    } finally {
      setWorking(false)
    }
  }
 
  async function handleCancelBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setWorking(true)
    setMessage(null)
 
    try {
      await cancelBooking(cancelForm.flightId, cancelForm.email)
 
      setCancelForm({ flightId: '', email: '' })
      setBookings((current) =>
        current.filter((booking) => booking.id.toString() !== cancelForm.flightId),
      )
      setMessage({ type: 'success', text: 'Booking cancelled successfully.' })
      await loadFlights()
    } catch (error) {
      const text =
        error instanceof Error ? error.message : 'Unable to cancel booking'
      setMessage({ type: 'error', text })
    } finally {
      setWorking(false)
    }
  }
 
  return (
    <main className="flights-page">
      <PageHeader
        title={getHeading(view)}
        description={getDescription(view)}
        loading={loading}
        working={working}
        onRefresh={() => {
          setMessage(null)
          void loadFlights()
        }}
      />
 
      <StatusMessage message={message} />
 
      <FlightSummary totalCount={flights.length} availableCount={availableCount} />
 
      {isBookingView ? (
        <>
          <BookingTools
            cancelForm={cancelForm}
            lookupEmail={lookupEmail}
            working={working}
            onCancelFormChange={setCancelForm}
            onLookupEmailChange={setLookupEmail}
            onCancelSubmit={handleCancelBooking}
            onLookupSubmit={handleLookupBookings}
          />
          <BookingResults bookings={bookings} />
        </>
      ) : (
        <section className="booking-layout">
          <div>
            <FlightGrid
              flights={flights}
              loading={loading}
              selectedFlight={selectedFlight}
              onSelectFlight={setSelectedFlight}
            />
          </div>
 
          <BookFlightForm
            bookingForm={bookingForm}
            selectedFlight={selectedFlight}
            working={working}
            onBookingFormChange={setBookingForm}
            onSubmit={handleBookFlight}
          />
        </section>
      )}
    </main>
  )
}
 
export default AllFlightsPage