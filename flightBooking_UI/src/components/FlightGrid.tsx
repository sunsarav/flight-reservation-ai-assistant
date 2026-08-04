import type { Flight } from '../types/Flight'
import FlightCard from './FlightCard'
 
interface FlightGridProps {
  flights: Flight[]
  loading: boolean
  selectedFlight: Flight | null
  onSelectFlight: (flight: Flight) => void
}
 
function FlightGrid({
  flights,
  loading,
  selectedFlight,
  onSelectFlight,
}: FlightGridProps) {
  if (loading) {
    return <p className="page-message">Loading flights...</p>
  }
 
  if (flights.length === 0) {
    return <p className="page-message">No flights were found.</p>
  }
 
  return (
    <section className="flight-grid">
      {flights.map((flight) => (
        <FlightCard
          flight={flight}
          key={flight.id}
          selected={selectedFlight?.id === flight.id}
          onSelect={onSelectFlight}
        />
      ))}
    </section>
  )
}
 
export default FlightGrid
 