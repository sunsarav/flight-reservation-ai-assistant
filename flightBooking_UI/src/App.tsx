import { Navigate, NavLink, Route, Routes } from 'react-router'
import { CalendarCheck, Plane, SearchCheck, Sparkles } from 'lucide-react'
import AllFlightsPage from './pages/AllFlightsPage'
import ChatComponent from './components/ChatComponent'
import './App.css'

function App() {
  return (
      <div className="app-shell">

        {/* =========================
          TOP HEADER
      ========================= */}

        <header className="top-header">

          <div className="brand">

            <div className="brand-icon">
              <Plane size={25} strokeWidth={2.4} />
            </div>

            <div className="brand-text">
              <div className="brand-name">
                SkyBook
              </div>

              <div className="brand-subtitle">
                Flight Reservation System
              </div>
            </div>

          </div>


          {/* =========================
            AI ASSISTANT BADGE
        ========================= */}

          <div className="assistant-badge">

            <Sparkles size={17} />

            <div>
            <span className="assistant-badge-name">
              SkyMate
            </span>

              <span className="assistant-badge-text">
              AI Flight Assistant
            </span>
            </div>

          </div>

        </header>


        {/* =========================
          NAVIGATION
      ========================= */}

        <nav
            className="navigation"
            aria-label="Main navigation"
        >

          <NavLink
              to="/flights"
              className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
              }
          >
            <Plane size={18} />
            <span>All Flights</span>
          </NavLink>


          <NavLink
              to="/available"
              className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
              }
          >
            <CalendarCheck size={18} />
            <span>Available Flights</span>
          </NavLink>


          <NavLink
              to="/bookings"
              className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
              }
          >
            <SearchCheck size={18} />
            <span>My Bookings</span>
          </NavLink>

        </nav>


        {/* =========================
          MAIN APPLICATION AREA
      ========================= */}

        <main className="main-content">

          <Routes>

            <Route
                path="/"
                element={
                  <Navigate
                      to="/flights"
                      replace
                  />
                }
            />

            <Route
                path="/flights"
                element={
                  <AllFlightsPage view="all" />
                }
            />

            <Route
                path="/available"
                element={
                  <AllFlightsPage view="available" />
                }
            />

            <Route
                path="/bookings"
                element={
                  <AllFlightsPage view="bookings" />
                }
            />

          </Routes>

        </main>


        {/* =========================
          AI ASSISTANT
      ========================= */}

        <section className="assistant-section">

          <div className="assistant-section-heading">

            <div>
              <div className="assistant-label">
                <Sparkles size={15} />
                AI POWERED
              </div>

              <h2>
                Meet SkyMate
              </h2>

              <p>
                Your personal flight assistant
              </p>
            </div>

          </div>

          <ChatComponent />

        </section>

      </div>
  )
}

export default App