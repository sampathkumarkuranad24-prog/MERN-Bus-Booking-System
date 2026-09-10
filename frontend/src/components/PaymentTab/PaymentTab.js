import React from 'react';
import './PaymentTab.css';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const methods = [
  { id: 'PhonePe', icon: '🟣', text: 'PhonePe' },
  { id: 'Google Pay', icon: '🟢', text: 'Google Pay' },
  { id: 'Paytm', icon: '🔵', text: 'Paytm' },
  { id: 'BHIM UPI', icon: '🟠', text: 'BHIM UPI' },
  { id: 'UPI', icon: '💳', text: 'Other UPI' }
];

export default class PaymentTab extends React.Component {
  state = { method: 'PhonePe', upiId: '', processing: false, error: '', token: null };

  componentDidMount() {
    const tok = sessionStorage.getItem('authToken');
    if (tok) {
      try { this.setState({ token: jwt_decode(tok).user }); } catch (e) {}
    }
  }

  submit = async (e) => {
    e.preventDefault();
    const seats = JSON.parse(localStorage.getItem('reservedSeats') || '[]');
    const passengers = JSON.parse(localStorage.getItem('passengerData') || '{}');
    if (!seats.length) return this.setState({ error: 'Please select seats first.' });
    if (this.state.method === 'UPI' && !this.state.upiId.trim()) return this.setState({ error: 'Enter your UPI ID for Other UPI.' });

    const price = Number(localStorage.getItem('pricePerSeat') || 1000);
    const total = price * seats.length + 150;
    const transactionId = 'UT' + Date.now().toString().slice(-10);
    const token = sessionStorage.getItem('authToken');
    if (!token) return this.setState({ error: 'Please login again before payment.' });

    this.setState({ processing: true, error: '' });
    try {
      await axios.post('http://localhost:8080/bookings?secret_token=' + encodeURIComponent(token), {
        startCity: localStorage.getItem('start') || '',
        destination: localStorage.getItem('destination') || '',
        journeyDate: localStorage.getItem('date') || '',
        busNumber: localStorage.getItem('busNumber') || localStorage.getItem('selectedBusId') || '',
        companyName: localStorage.getItem('busCompany') || 'Unique Travels',
        busType: localStorage.getItem('busType') || '',
        seats,
        passengers: seats.map(seat => ({ seat, ...(passengers[seat] || {}) })),
        pricePerSeat: price,
        totalAmount: total,
        paymentMethod: this.state.method,
        transactionId
      });

      localStorage.setItem('transactionId', transactionId);
      localStorage.setItem('paymentStatus', 'Paid');
      localStorage.setItem('paymentMethod', this.state.method);
      localStorage.setItem('upiId', this.state.upiId);
      this.props.history.push('/getTicket');
    } catch (err) {
      this.setState({ processing: false, error: err.response?.data?.message || 'Payment/booking failed. Make sure the backend is running.' });
    }
  };

  render() {
    const seats = JSON.parse(localStorage.getItem('reservedSeats') || '[]');
    const price = Number(localStorage.getItem('pricePerSeat') || 1000);
    const total = price * seats.length + 150;
    return (
      <div className="paym container py-4">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="card p-4 shadow payment-card">
              <h3 className="text-center">Online Payment</h3>
              <p className="text-center text-muted">Choose your preferred UPI payment method</p>

              <div className="payment-method-grid">
                {methods.map(method => (
                  <button type="button" key={method.id}
                    className={`payment-method ${this.state.method === method.id ? 'selected' : ''}`}
                    onClick={() => this.setState({ method: method.id, error: '' })}>
                    <span className="payment-icon">{method.icon}</span>
                    <span>{method.text}</span>
                  </button>
                ))}
              </div>

              {this.state.method === 'UPI' && (
                <input className="form-control mt-3" placeholder="Enter UPI ID (example: name@upi)"
                  value={this.state.upiId} onChange={e => this.setState({ upiId: e.target.value })} />
              )}

              <div className="demo-note mt-3">Demo online payment for your academic project. No real money is charged.</div>
              {this.state.error && <div className="alert alert-danger mt-3">{this.state.error}</div>}
              {this.state.processing && <div className="alert alert-info mt-3">Processing your demo payment...</div>}

              <hr />
              <p><b>Route:</b> {localStorage.getItem('start')} → {localStorage.getItem('destination')}</p>
              <p><b>Seats:</b> {seats.join(', ') || 'None'}</p>
              <p><b>Payment Method:</b> {this.state.method}</p>
              <h4>Total: ₹{total}</h4>
              <button className="btn btn-success btn-block mt-2" disabled={this.state.processing} onClick={this.submit}>
                {this.state.processing ? 'PROCESSING...' : `PAY ₹${total} WITH ${this.state.method.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
