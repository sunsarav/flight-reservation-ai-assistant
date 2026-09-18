import { useState } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router'
import {
    CalendarCheck,
    Plane,
    SearchCheck,
    Sparkles,
} from 'lucide-react'

import AllFlightsPage from './pages/AllFlightsPage'
import ChatComponent from './components/ChatComponent'
import './App.css'

function App() {
    const [isChatOpen, setIsChatOpen] = useState(false)

    return (
        <div className="app-shell">

            {/* TOP HEADER */}
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


                {/* SKYMATE BUTTON */}
                <button
                    type="button"
                    className={`assistant-badge ${
                        isChatOpen ? 'active' : ''
                    }`}
                    onClick={() =>
                        setIsChatOpen((current) => !current)
                    }
                    aria-label={
                        isChatOpen
                            ? 'Close SkyMate'
                            : 'Open SkyMate'
                    }
                    aria-expanded={isChatOpen}
                >

                    <div className="assistant-badge-icon">
                        <Sparkles size={17} />
                    </div>

                    <div className="assistant-badge-content">

                        <span className="assistant-badge-name">
                            SkyMate
                        </span>

                        <span className="assistant-badge-text">
                            AI Flight Assistant
                        </span>

                    </div>

                    <span className="assistant-status">

                        <span className="status-dot"></span>

                        {isChatOpen
                            ? 'Open'
                            : 'Online'}

                    </span>

                </button>

            </header>


            {/* NAVIGATION */}
            <nav
                className="navigation"
                aria-label="Main navigation"
            >

                <NavLink
                    to="/flights"
                    className={({ isActive }) =>
                        `nav-link ${
                            isActive ? 'active' : ''
                        }`
                    }
                >
                    <Plane size={18} />
                    <span>All Flights</span>
                </NavLink>


                <NavLink
                    to="/available"
                    className={({ isActive }) =>
                        `nav-link ${
                            isActive ? 'active' : ''
                        }`
                    }
                >
                    <CalendarCheck size={18} />
                    <span>Available Flights</span>
                </NavLink>


                <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                        `nav-link ${
                            isActive ? 'active' : ''
                        }`
                    }
                >
                    <SearchCheck size={18} />
                    <span>My Bookings</span>
                </NavLink>

            </nav>


            {/* PAGE CONTENT */}
            <div className="main-content">

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

            </div>


            {/* SKYMATE CHAT */}
            <div
                className={`floating-chat-wrapper ${
                    isChatOpen ? 'open' : ''
                }`}
            >

                <div className="floating-chat">

                    <ChatComponent />

                </div>

            </div>

        </div>
    )
}

export default App