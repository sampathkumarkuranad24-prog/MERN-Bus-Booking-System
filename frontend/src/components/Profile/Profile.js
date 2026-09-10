import React, { useEffect, useState } from 'react';
import './profile.css';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export default function Profile({ history }) {
  const [user, setUser] = useState({});
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const tok = sessionStorage.getItem('authToken');
    if (!tok) {
      history.push('/login');
      return;
    }
    try {
      const decoded = jwt_decode(tok);
      setUser(decoded.user || {});
      axios.get('http://localhost:8080/bookings?secret_token=' + encodeURIComponent(tok))
        .then(res => setBookingCount((res.data.bookings || []).length))
        .catch(() => {});
    } catch (e) {
      sessionStorage.clear();
      history.push('/login');
    }
  }, [history]);

  const signOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className="container">
      <section className="profile">
        <header className="header">
          <div className="details">
            <img
              src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=200&q=80"
              alt="Profile"
              className="profile-pic"
            />
            <h1 className="heading">{user.name || 'Passenger'}</h1>
            <div className="location"><p>{user.email || ''}</p></div>

            <div className="stats">
              <div className="col-4"><h4>{bookingCount}</h4><p>Bookings</p></div>
              <div className="col-4"><h4>UPI</h4><p>Payment</p></div>
              <div className="col-4"><h4>UT</h4><p>Travels</p></div>
            </div>

            <div className="mt-4">
              <button className="btn btn-primary mr-2" onClick={() => history.push('/history')}>BOOKING HISTORY</button>
              <button className="btn btn-dark" onClick={() => history.push('/routes')}>BOOK A BUS</button>
              <button className="btn btn-outline-light ml-2" onClick={signOut}>SIGN-OUT</button>
            </div>
          </div>
        </header>
      </section>
    </div>
  );
}
