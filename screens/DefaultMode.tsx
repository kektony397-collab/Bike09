
import React, { useState, useEffect, useCallback } from 'react';
import { Bike } from '../types';
import { useLocation } from '../hooks/useLocation';
import Speedometer from '../components/Speedometer';

interface DefaultModeProps {
  bike: Bike;
}

const DefaultMode: React.FC<DefaultModeProps> = ({ bike }) => {
  const { isTracking, locationData, distance, error, startTracking, stopTracking, resetDistance } = useLocation();
  const [petrolRefilled, setPetrolRefilled] = useState<number>(() => {
    const saved = localStorage.getItem('petrolRefilled');
    return saved ? parseFloat(saved) : 5;
  });
  const [petrolLevel, setPetrolLevel] = useState<number>(petrolRefilled);
  
  const totalRange = petrolRefilled * bike.mileage;
  const remainingRange = Math.max(0, totalRange - distance);
  const petrolLeft = Math.max(0, (remainingRange / bike.mileage));
  
  const showNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }, []);

  useEffect(() => {
    if (petrolLeft < 1 && petrolLeft > 0.9) { // Trigger once when crossing the 1L threshold
        showNotification('Low Fuel Warning', `Your bike is about to enter reserve mode. Estimated ${remainingRange.toFixed(0)} km left.`);
    }
  }, [petrolLeft, remainingRange, showNotification]);

  const handleRefill = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('petrolRefilled', petrolRefilled.toString());
    setPetrolLevel(petrolRefilled);
    resetDistance();
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{bike.name}</h1>
        <p className="text-brand-text-secondary">{bike.manufacturer} | {bike.mileage} km/l (avg)</p>
      </div>

      <Speedometer
        speed={locationData.speed}
        distance={distance}
        totalRange={totalRange}
        remainingRange={remainingRange}
        petrolLeft={petrolLeft}
        optimalMin={40}
        optimalMax={55}
      />

      <div className="w-full max-w-sm mx-auto space-y-4">
        <form onSubmit={handleRefill} className="flex gap-2 items-end">
          <div className="flex-grow">
            <label htmlFor="petrol" className="block text-sm font-medium text-brand-text-secondary">
              Refill Petrol (Liters)
            </label>
            <input
              id="petrol"
              type="number"
              step="0.1"
              value={petrolRefilled}
              onChange={(e) => setPetrolRefilled(parseFloat(e.target.value))}
              className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-brand-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
              min="0"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-brand-secondary text-brand-bg font-bold rounded-md hover:opacity-90 transition">
            Reset
          </button>
        </form>

        <div className="flex gap-4">
          <button
            onClick={isTracking ? stopTracking : startTracking}
            className={`w-full py-3 text-lg font-bold rounded-lg transition ${
              isTracking ? 'bg-brand-accent text-white' : 'bg-brand-primary text-white'
            }`}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
        </div>
        {error && <p className="text-brand-accent text-center">{error}</p>}
      </div>
    </div>
  );
};

export default DefaultMode;
