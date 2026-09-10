import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

export default function History({ history }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) { history.push('/login'); return; }
    axios.get('http://localhost:8080/bookings?secret_token=' + encodeURIComponent(token))
      .then(res => setBookings(res.data.bookings || []))
      .catch(err => setError(err.response?.data?.message || 'Unable to load booking history.'))
      .finally(() => setLoading(false));
  }, [history]);

  const formatDate = value => value ? new Date(value).toLocaleDateString('en-IN') : '-';

  return (
    <div className="history-page container py-4">
      <nav className="navbar navbar-dark bg-dark mb-4 rounded px-3">
        <button className="navbar-brand btn btn-link text-white" onClick={() => history.push('/routes')}>UT • Unique Travels</button>
        <div>
          <button className="btn btn-link text-white" onClick={() => history.push('/profile')}>Profile</button>
          <button className="btn btn-link text-white" onClick={() => history.push('/routes')}>Book Again</button>
          <button className="btn btn-link text-white" onClick={() => { sessionStorage.clear(); localStorage.clear(); history.push('/'); }}>Sign-Out</button>
        </div>
      </nav>

      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div><h2 className="mb-1">Booking History</h2><p className="text-muted mb-0">Your previous bookings and online payment history</p></div>
          <span className="badge badge-primary p-2">{bookings.length} Booking{bookings.length !== 1 ? 's' : ''}</span>
        </div>

        {loading && <p className="text-center">Loading history...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && bookings.length === 0 && <div className="empty-history text-center"><div className="empty-icon">🚌</div><h4>No bookings yet</h4><p>Book a bus and your booking/payment history will appear here.</p><button className="btn btn-primary" onClick={() => history.push('/routes')}>Book a Bus</button></div>}

        {!loading && bookings.map(booking => (
          <div className="history-item" key={booking.transactionId}>
            <div className="row">
              <div className="col-md-7">
                <h5>{booking.startCity} → {booking.destination}</h5>
                <p className="mb-1"><b>Bus:</b> {booking.companyName} • {booking.busNumber} {booking.busType ? `• ${booking.busType}` : ''}</p>
                <p className="mb-1"><b>Journey Date:</b> {booking.journeyDate}</p>
                <p className="mb-1"><b>Seats:</b> {booking.seats.join(', ')}</p>
                <small className="text-muted">Booked on {formatDate(booking.createdAt)}</small>
              </div>
              <div className="col-md-5 payment-summary">
                <div><b>Payment:</b> <span className="text-success">{booking.paymentStatus}</span></div>
                <div><b>Method:</b> {booking.paymentMethod}</div>
                <div><b>Amount:</b> ₹{booking.totalAmount}</div>
                <div className="transaction">Transaction: {booking.transactionId}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
