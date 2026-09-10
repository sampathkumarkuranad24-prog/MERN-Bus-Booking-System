import React from 'react';
import './busList.css';

export default function BusList({ value = [], onSelectBus }) {
  if (!value.length) return <p className="text-center mt-4">Search a route to see available buses.</p>;
  return <div>{value.map((bus) => (
    <div key={bus._id} className="card mt-4 p-3 buslist">
      <div className="row">
        <div className="col-md-3"><b>Brand</b><br/>{bus.companyName}</div>
        <div className="col-md-2"><b>From</b><br/>{bus.startCity}</div>
        <div className="col-md-2"><b>To</b><br/>{bus.destination}</div>
        <div className="col-md-2"><b>Price</b><br/>₹{bus.pricePerSeat}</div>
        <div className="col-md-3"><b>Bus</b><br/>{bus.busNumber}<br/><button className="btn btn-primary mt-2" onClick={() => onSelectBus(bus)}>Select Bus</button></div>
      </div>
    </div>
  ))}</div>;
}
