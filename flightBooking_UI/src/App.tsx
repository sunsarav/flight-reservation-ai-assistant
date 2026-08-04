import { Navigate, NavLink, Route, Routes } from 'react-router'
import { CalendarCheck, Plane, SearchCheck } from 'lucide-react'
import AllFlightsPage from './pages/AllFlightsPage'
import './App.css'
 
function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Plane size={26} />
          <div>
            <span>Flight Reservation</span>
            <strong>Booking Desk</strong>
          </div>
        </div>
 
        <nav className="navigation" aria-label="Main navigation">
          <NavLink to="/flights">
            <Plane size={19} />
            All flights
          </NavLink>
          <NavLink to="/available">
            <CalendarCheck size={19} />
            Available
          </NavLink>
          <NavLink to="/bookings">
            <SearchCheck size={19} />
            Bookings
          </NavLink>
        </nav>
      </aside>
 
      <Routes>
        <Route path="/" element={<Navigate to="/flights" replace />} />
        <Route path="/flights" element={<AllFlightsPage view="all" />} />
        <Route path="/available" element={<AllFlightsPage view="available" />} />
        <Route path="/bookings" element={<AllFlightsPage view="bookings" />} />
      </Routes>
    </div>
  )
}
 
export default App