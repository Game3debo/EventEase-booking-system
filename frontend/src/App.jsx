import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000";

function App() {
 
const [location, setLocation] = useState("");
const [date, setDate] = useState("");
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [selectedEvent, setSelectedEvent] = useState(null);
const [customerName, setCustomerName] = useState("");
const [customerEmail, setCustomerEmail] = useState("");
const [tickets, setTickets] = useState(1);
const [bookingMessage, setBookingMessage] = useState("");
const [bookingLoading, setBookingLoading] = useState(false);
const [bookings, setBookings] = useState([]);
const [bookingsError, setBookingsError] = useState("");


const filteredEvents = events.filter((event) => {
  const matchesLocation = (event.location || "")
    .toLowerCase()
    .includes(location.trim().toLowerCase());

  const matchesDate =
    !date ||
    new Date(event.event_date).toISOString().slice(0, 10) === date;

  return matchesLocation && matchesDate;
});

const handleSearch = (e) => {
  e.preventDefault();

  document.getElementById("events").scrollIntoView({
    behavior: "smooth",
  });
};

const handleBooking = async (e) => {
  e.preventDefault();

  if (!selectedEvent) return;

  setBookingMessage("");
  setBookingLoading(true);

  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id: selectedEvent.id,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        tickets: Number(tickets),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Booking failed.");
    }

    setBookingMessage("Booking successful! Your booking has been saved.");
    await fetchBookings();
    setCustomerName("");
    setCustomerEmail("");
    setTickets(1);
  } catch (err) {
    setBookingMessage(err.message);
  } finally {
    setBookingLoading(false);
  }
  useEffect(() => {
  fetchBookings();
}, []);
};


useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);

      if (!response.ok) {
        throw new Error("Could not load events.");
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError("Unable to load events. Please check the backend.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);


const fetchBookings = async () => {
  try {
    setBookingsError("");

    const response = await fetch(`${API_URL}/bookings`);

    if (!response.ok) {
      throw new Error("Unable to fetch bookings");
    }

    const data = await response.json();
    setBookings(data.bookings || []);
  } catch (error) {
    setBookingsError(error.message);
  }
};

const cancelBooking = async (bookingId) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API_URL}/bookings/${bookingId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Cancellation failed");
    }

    alert("Booking cancelled successfully!");

    await fetchBookings();
  } catch (error) {
    alert(error.message);
  }
};


  return (
    <div className="app">
      <header className="navbar">
        <a href="#" className="logo">Event<span>Ease</span></a>

        <nav>
          <a href="#home">Home</a>
          <a href="#events">Events</a>
<a href="#bookings">My Bookings</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </nav>

        <a href="#events" className="nav-button">Book Now</a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">YOUR EVENT, YOUR EXPERIENCE</span>
            <h1>Discover & Book <span>Unforgettable Events</span></h1>
            <p>
              Find amazing events, explore beautiful venues, and
              reserve your spot with ease.
            </p>

            <form className="search-box" onSubmit={handleSearch}>
              <label>
                Location
                <input
                  type="text"
                  placeholder="Enter city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>

              <label>
                Event Date
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <button type="submit">Find Events →</button>
            </form>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <span className="eyebrow">EXPLORE EVENTS</span>
            <h2>Featured Events</h2>
            <p>Discover exciting experiences waiting for you.</p>
          </div>

          {loading && <p>Loading events...</p>}
{error && <p>{error}</p>}
{!loading && !error && events.length === 0 && (
  <p>No events available yet.</p>
)}

{!loading && !error && filteredEvents.length === 0 && (
  <p>No events match your search. Try another location or date.</p>
)}
          <div className="event-grid">
           {filteredEvents.map((event) => (
             
<article className="event-card" key={event.id}>
  <img
    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
    alt={event.title}
  />
  <div className="event-info">
    <span className="category">Event</span>
    <h3>{event.title}</h3>
    <p>📍 {event.location}</p>
    <p>
      📅 {new Date(event.event_date).toLocaleDateString()}
    </p>
    <p>Available capacity: {event.capacity}</p>
   <button
  type="button"
  onClick={() => setSelectedEvent(event)}
>
  View Details →
</button>
  </div>
</article>

            ))}
          </div>
        </section>

{selectedEvent && (
  <div className="event-details">
    <h2>{selectedEvent.title}</h2>
    <p>{selectedEvent.description}</p>
    <p>📍 Location: {selectedEvent.location}</p>
    <p>
      📅 Date:{" "}
      {new Date(selectedEvent.event_date).toLocaleString()}
    </p>
    <p>🎟️ Capacity: {selectedEvent.capacity}</p>

<form onSubmit={handleBooking} className="booking-form">
  <h3>Book Tickets</h3>

  <label>
    Full Name
    <input
      type="text"
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
      required
    />
  </label>

  <label>
    Email Address
    <input
      type="email"
      value={customerEmail}
      onChange={(e) => setCustomerEmail(e.target.value)}
      required
    />
  </label>

  <label>
    Number of Tickets
    <input
      type="number"
      min="1"
      max={selectedEvent.capacity}
      value={tickets}
      onChange={(e) => setTickets(e.target.value)}
      required
    />
  </label>

  <button type="submit" disabled={bookingLoading}>
    {bookingLoading ? "Booking..." : "Confirm Booking"}
  </button>

  {bookingMessage && <p role="status">{bookingMessage}</p>}
</form>

    <button
      type="button"
      onClick={() => setSelectedEvent(null)}
    >
      Close Details
    </button>
  </div>
)}

<section className="events-section" id="bookings">
  <div className="section-heading">
    <span className="eyebrow">YOUR RESERVATIONS</span>
    <h2>My Bookings</h2>
    <p>View bookings saved in the database.</p>
  </div>

  <button type="button" onClick={fetchBookings}>
    Load Bookings
  </button>

  {bookingsError && <p role="alert">{bookingsError}</p>}

  <div className="event-grid">
    {bookings.map((booking) => (
      <article className="event-card" key={booking.id}>
        <div className="event-info">
          <h3>{booking.event_title}</h3>
          <p>Name: {booking.customer_name}</p>
          <p>Email: {booking.customer_email}</p>
          <p>Tickets: {booking.tickets}</p>
          <p>Location: {booking.location}</p>
          <p>Booking ID: {booking.id}</p>
          <button
  type="button"
  onClick={() => cancelBooking(booking.id)}
>
  Cancel Booking
</button>
        </div>
      </article>
    ))}
  </div>
</section>

        <section className="features" id="features">
          <div className="section-heading">
            <span className="eyebrow">WHY CHOOSE US</span>
            <h2>Booking Made Simple</h2>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Booking</h3>
              <p>Reserve your event space in a few simple steps.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🗓️</div>
              <h3>Availability Calendar</h3>
              <p>Explore dates and choose your preferred slot.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Pay securely when payment integration is enabled.</p>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <h2>Event<span>Ease</span></h2>
        <p>Making every event unforgettable.</p>
        <p>© {new Date().getFullYear()} EventEase. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
