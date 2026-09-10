import React, { useState } from 'react';
import './Tab.css';

const blocked = ['1A','2A','2B','3B','4A','5C','6A','7B','7C','8B','9B','9C'];
const seats = Array.from({length: 30}, (_, i) => `${Math.floor(i/3)+1}${['A','B','C'][i%3]}`);

export default function SeatSelection({ onContinue }) {
  const [selected, setSelected] = useState([]);
  const [passengers, setPassengers] = useState({});
  const toggle = (seat) => setSelected(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  const update = (seat, field, value) => setPassengers(prev => ({...prev, [seat]: {...prev[seat], [field]: value}}));
  const confirm = () => {
    if (!selected.length) return alert('Please select at least one seat.');
    if (selected.some(s => !passengers[s]?.name || !passengers[s]?.gender)) return alert('Enter passenger name and gender for every selected seat.');
    localStorage.setItem('reservedSeats', JSON.stringify(selected));
    localStorage.setItem('nameData', JSON.stringify(selected.map(s => passengers[s].name)));
    localStorage.setItem('passengerData', JSON.stringify(passengers));
    onContinue();
  };
  return <div className="ss p-3">
    <h3 className="text-center mb-3">Select Your Seats</h3>
    <div className="d-flex flex-wrap justify-content-center" style={{maxWidth: 520, margin: 'auto'}}>
      {seats.map(seat => <button key={seat} type="button" disabled={blocked.includes(seat)} onClick={() => toggle(seat)} className={`m-2 btn ${blocked.includes(seat) ? 'btn-secondary' : selected.includes(seat) ? 'btn-success' : 'btn-outline-primary'}`}>{seat}</button>)}
    </div>
    {selected.map(seat => <div className="card p-3 m-2" key={seat}>
      <b>Seat {seat}</b>
      <input className="form-control mt-2" placeholder="Passenger name" value={passengers[seat]?.name || ''} onChange={e => update(seat,'name',e.target.value)} />
      <select className="form-control mt-2" value={passengers[seat]?.gender || ''} onChange={e => update(seat,'gender',e.target.value)}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select>
    </div>)}
    <div className="text-center mt-3"><button className="btn btn-info" onClick={confirm}>Confirm Details & Continue to Payment</button></div>
  </div>;
}
