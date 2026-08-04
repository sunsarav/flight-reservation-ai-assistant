interface FlightSummaryProps {
  totalCount: number
  availableCount: number
}
 
function FlightSummary({ totalCount, availableCount }: FlightSummaryProps) {
  return (
    <section className="dashboard-summary" aria-label="Flight summary">
      <div>
        <span>Total flights</span>
        <strong>{totalCount}</strong>
      </div>
      <div>
        <span>Available</span>
        <strong>{availableCount}</strong>
      </div>
      <div>
        <span>Booked</span>
        <strong>{totalCount - availableCount}</strong>
      </div>
    </section>
  )
}
 
export default FlightSummary