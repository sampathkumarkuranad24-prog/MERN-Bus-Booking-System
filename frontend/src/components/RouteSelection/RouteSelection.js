import React, { useState } from 'react';
import RouteSelector from '../routeSelector/Routeselector';
import SeatSelection from '../SeatSelection/SeatSelection';
import PaymentTab from '../PaymentTab/PaymentTab';

export default function RouteSelection({ history }) {
  const [step, setStep] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);

  const selectBus = (bus) => {
    setSelectedBus(bus);
    localStorage.setItem('selectedBusId', bus._id);
    localStorage.setItem('busCompany', bus.companyName || 'Unique Travels');
    localStorage.setItem('busNumber', bus.busNumber || '');
    localStorage.setItem('busType', bus.busType || '');
    localStorage.setItem('pricePerSeat', bus.pricePerSeat || '1000');
    setStep(2);
  };

  const signOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className="container">
      <nav className="mb-4 navbar navbar-expand-lg navbar-dark bg-dark">
        <button className="navbar-brand btn btn-link text-white" onClick={() => setStep(1)}>UT</button>
        <div className="ml-auto">
          <button className="btn btn-link text-white" onClick={() => history.push('/profile')}>Profile</button>
          <button className="btn btn-link text-white" onClick={() => history.push('/history')}>Booking History</button>
          <button className="btn btn-link text-white" onClick={signOut}>Sign-Out</button>
        </div>
      </nav>

      <div className="d-flex flex-wrap justify-content-center mb-4">
        {[['1','Select Bus'],['2','Select Seat'],['3','Payment']].map(([n,label]) => (
          <button key={n} className={`btn mx-1 mb-2 ${step === Number(n) ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => {
            if (Number(n) === 1 || (Number(n) === 2 && selectedBus) || (Number(n) === 3 && selectedBus && localStorage.getItem('reservedSeats'))) setStep(Number(n));
          }}>{n}. {label}</button>
        ))}
      </div>

      {step === 1 && <RouteSelector onBusSelected={selectBus} />}
      {step === 2 && <SeatSelection onContinue={() => setStep(3)} />}
      {step === 3 && <PaymentTab history={history} />}
    </div>
  );
}
