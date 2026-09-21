export type FlightStatus = 'AVAILABLE' | 'BOOKED'

export interface Flight {
  id: number
  flightNumber: string
  departureTime: string
  arrivalTime: string
  status: FlightStatus
  destination: string
  price: number
}

export type AvailableFlight = Omit<Flight, 'status'>

export interface Booking extends Flight {
  passengerName: string
  passengerEmail: string
}

export interface BookingRequest {
  passengerName: string
  passengerEmail: string
}