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

    if (view === 'available') {
        return 'Browse flights that are currently available for booking.'
    }

    return 'Browse all flights, choose an available seat, and confirm a booking.'
}

function AllFlightsPage({ view }: AllFlightsPageProps) {
    /*
     * Flights displayed in the current page.
     *
     * Examples:
     * - All Flights page  -> all flights
     * - Available Flights -> available flights only
     */
    const [flights, setFlights] = useState<Flight[]>([])

    /*
     * ALL flights from the database.
     *
     * This is used for the dashboard statistics.
     */
    const [allFlights, setAllFlights] = useState<Flight[]>([])

    const [bookings, setBookings] = useState<Booking[]>([])

    const [selectedFlight, setSelectedFlight] =
        useState<Flight | null>(null)

    const [bookingForm, setBookingForm] =
        useState<BookingRequest>({
            passengerName: '',
            passengerEmail: '',
        })

    const [lookupEmail, setLookupEmail] = useState('')

    const [cancelForm, setCancelForm] =
        useState<CancelForm>({
            flightId: '',
            email: '',
        })

    const [loading, setLoading] = useState(true)

    const [working, setWorking] = useState(false)

    const [message, setMessage] =
        useState<ApiMessage>(null)

    const isBookingView = view === 'bookings'

    /*
     * Load flight data.
     *
     * This function is used after:
     * - booking a flight
     * - cancelling a booking
     * - manually refreshing the page
     *
     * It is NOT called directly from useEffect.
     */
    const loadFlights = useCallback(async () => {
        setLoading(true)

        try {
            /*
             * Always retrieve the complete flight list.
             */
            const allFlightData = await getAllFlights()

            setAllFlights(allFlightData)

            /*
             * Decide which flights should actually appear
             * in the current page.
             */
            if (view === 'available') {
                const availableFlightData =
                    await getAvailableFlights()

                setFlights(availableFlightData)
            } else {
                setFlights(allFlightData)
            }
        } catch (error) {
            const text =
                error instanceof Error
                    ? error.message
                    : 'Unable to load flights'

            setMessage({
                type: 'error',
                text,
            })
        } finally {
            setLoading(false)
        }
    }, [view])

    /*
     * Initial flight loading when the page/view changes.
     *
     * IMPORTANT:
     * We use an async function inside the effect and perform
     * the state updates after awaiting the API request.
     *
     * This avoids the react-hooks/set-state-in-effect lint error.
     */
    useEffect(() => {
        let cancelled = false

        const loadInitialFlights = async () => {
            try {
                const allFlightData = await getAllFlights()

                if (cancelled) {
                    return
                }

                setAllFlights(allFlightData)

                if (view === 'available') {
                    const availableFlightData =
                        await getAvailableFlights()

                    if (cancelled) {
                        return
                    }

                    setFlights(availableFlightData)
                } else {
                    setFlights(allFlightData)
                }
            } catch (error) {
                if (cancelled) {
                    return
                }

                const text =
                    error instanceof Error
                        ? error.message
                        : 'Unable to load flights'

                setMessage({
                    type: 'error',
                    text,
                })
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        void loadInitialFlights()

        return () => {
            cancelled = true
        }
    }, [view])

    /*
     * Calculate statistics from ALL flights,
     * NOT from the filtered list.
     */
    const availableCount = useMemo(
        () =>
            allFlights.filter(
                (flight) => flight.status === 'AVAILABLE',
            ).length,
        [allFlights],
    )

    /*
     * Total number of flights in the system.
     */
    const totalCount = allFlights.length

    async function handleBookFlight(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        if (!selectedFlight) {
            setMessage({
                type: 'error',
                text: 'Choose an available flight first.',
            })

            return
        }

        setWorking(true)
        setMessage(null)

        try {
            const bookedFlight = await bookFlight(
                selectedFlight.id,
                bookingForm,
            )

            setMessage({
                type: 'success',
                text: `${bookedFlight.flightNumber} is booked for ${bookedFlight.passengerName}.`,
            })

            setBookingForm({
                passengerName: '',
                passengerEmail: '',
            })

            setSelectedFlight(null)

            /*
             * Reload both the displayed flights
             * and the dashboard statistics.
             */
            await loadFlights()
        } catch (error) {
            const text =
                error instanceof Error
                    ? error.message
                    : 'Unable to book this flight'

            setMessage({
                type: 'error',
                text,
            })
        } finally {
            setWorking(false)
        }
    }

    async function handleLookupBookings(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setWorking(true)
        setMessage(null)

        try {
            const data =
                await getBookingsByEmail(lookupEmail)

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
                error instanceof Error
                    ? error.message
                    : 'Unable to find bookings'

            setMessage({
                type: 'error',
                text,
            })
        } finally {
            setWorking(false)
        }
    }

    async function handleCancelBooking(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        setWorking(true)
        setMessage(null)

        try {
            await cancelBooking(
                cancelForm.flightId,
                cancelForm.email,
            )

            setCancelForm({
                flightId: '',
                email: '',
            })

            setBookings((current) =>
                current.filter(
                    (booking) =>
                        booking.id.toString() !==
                        cancelForm.flightId,
                ),
            )

            setMessage({
                type: 'success',
                text: 'Booking cancelled successfully.',
            })

            /*
             * Reload statistics after cancellation.
             *
             * A cancelled flight becomes AVAILABLE,
             * so both numbers need to update.
             */
            await loadFlights()
        } catch (error) {
            const text =
                error instanceof Error
                    ? error.message
                    : 'Unable to cancel booking'

            setMessage({
                type: 'error',
                text,
            })
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

            {/* Dashboard Summary */}
            <FlightSummary
                totalCount={totalCount}
                availableCount={availableCount}
            />

            {/* Bookings View */}
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
                /* Flight List + Booking Form */
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