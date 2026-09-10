import React, { useState } from 'react';
import * as apiCall from './routeApifunc';
import BusList from '../BusList/BusList';
import './Routeselector.css';

export default function Routeselector({ onBusSelected }) {
  const [startCity, setStartCity] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [buses, setBuses] = useState([]);
  const [message, setMessage] = useState('');

  const getRoutes = async (e) => {
    e.preventDefault();
    if (!startCity || !destination || !date) return setMessage('Please select From, To and Date.');
    if (startCity === destination) return setMessage('From and To locations must be different.');
    localStorage.setItem('start', startCity);
    localStorage.setItem('destination', destination);
    localStorage.setItem('date', date);
    try {
      const response = await apiCall.getRoutesFromApi(startCity, destination);
      setBuses(response.data.bus || []);
      setMessage((response.data.bus || []).length ? '' : 'No buses found for this route.');
    } catch (err) {
      setMessage('Unable to connect to the server. Make sure backend is running on port 8080.');
    }
  };

  return <div className="rdc">
    <form className="form-inline justify-content-center gap-2" onSubmit={getRoutes}>
      <select className="form-control m-1" value={startCity} onChange={e => setStartCity(e.target.value)}>
        <option value="">FROM</option>
        <option>Bangalore</option>
        <option>Chennai</option>
        <option>Hyderabad</option>
        <option>Coimbatore</option>
        <option>Mysore</option>
      </select>
      <select className="form-control m-1" value={destination} onChange={e => setDestination(e.target.value)}>
        <option value="">TO</option>
        <option>Hyderabad</option>
        <option>Chennai</option>
        <option>Bangalore</option>
        <option>Coimbatore</option>
        <option>Mysore</option>
      </select>
      <input className="form-control m-1" type="date" value={date} min={new Date().toISOString().slice(0,10)} onChange={e => setDate(e.target.value)} />
      <button className="btn btn-primary m-1" type="submit">Search Buses</button>
    </form>
    {message && <p className="text-center text-danger mt-3">{message}</p>}
    <BusList value={buses} onSelectBus={onBusSelected} />
  </div>;
}
