import React from 'react';
import './TicketPage.css';

export default function TicketPage({ history }) {
  const seats = JSON.parse(localStorage.getItem('reservedSeats') || '[]');
  const names = JSON.parse(localStorage.getItem('nameData') || '[]');
  const signOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className="container py-4">
      <nav className="navbar navbar-dark bg-dark mb-4">
        <span className="navbar-brand">UT • Unique Travels</span>
        <div>
          <button className="btn btn-outline-light mr-2" onClick={() => history.push('/history')}>Booking History</button>
          <button className="btn btn-outline-light mr-2" onClick={() => history.push('/routes')}>Book Again</button>
          <button className="btn btn-outline-light" onClick={signOut}>Sign-Out</button>
        </div>
      </nav>
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: 700 }}>
        <h2 className="text-center">🎟 Booking Confirmed</h2>
        <p className="text-center text-success font-weight-bold">Your online demo payment was successful.</p>
        <hr />
        <p><b>From:</b> {localStorage.getItem('start')}</p>
        <p><b>To:</b> {localStorage.getItem('destination')}</p>
        <p><b>Date:</b> {localStorage.getItem('date')}</p>
        <p><b>Bus:</b> {localStorage.getItem('busCompany')} ({localStorage.getItem('busNumber')})</p>
        <p><b>Bus Type:</b> {localStorage.getItem('busType') || '-'}</p>
        <p><b>Seats:</b> {seats.join(', ')}</p>
        <p><b>Passengers:</b> {names.join(', ')}</p>
        <p><b>Payment:</b> {localStorage.getItem('paymentStatus') || 'Paid'} via {localStorage.getItem('paymentMethod') || 'UPI'}</p>
        <p><b>Transaction ID:</b> {localStorage.getItem('transactionId')}</p>
        <p><b>Total:</b> ₹{Number(localStorage.getItem('pricePerSeat') || 1000) * seats.length + 150}</p>
        <div className="text-center mt-3">
          <button className="btn btn-primary mr-2" onClick={() => window.print()}>Print Ticket</button>
          <button className="btn btn-success" onClick={() => history.push('/history')}>View History</button>
        </div>
      </div>
    </div>
  );
}
