
import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';

const FindAverageMode: React.FC = () => {
  const { isTracking, locationData, distance, error, startTracking, stopTracking, resetDistance } = useLocation();
  const [petrolRefilled, setPetrolRefilled] = useState<number>(1);
  const [results, setResults] = useState<{ average: number; distance: number; petrol: number } | null>(null);
  const [history, setHistory] = useState<{ average: number; distance: number; petrol: number }[]>(() => {
    const saved = localStorage.getItem('averageHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
      localStorage.setItem('averageHistory', JSON.stringify(history));
  }, [history]);

  const handleReserveReached = () => {
    if (distance > 0 && petrolRefilled > 0) {
      // Assuming 1 liter is left for reserve
      const petrolConsumed = petrolRefilled - 1; 
      if (petrolConsumed > 0) {
        const average = distance / petrolConsumed;
        const newResult = { average, distance, petrol: petrolRefilled };
        setResults(newResult);
        setHistory(prev => [newResult, ...prev.slice(0, 4)]); // Keep last 5 results
        stopTracking();
      } else {
        alert("Please refill more than 1 liter to calculate average before reserve.");
      }
    } else {
        alert("Please start tracking and cover some distance first.");
    }
  };

  const handleStart = () => {
      setResults(null);
      resetDistance();
      startTracking();
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Find Your Bike's Average</h1>
        <p className="text-brand-text-secondary">Track your ride to calculate its real-world mileage.</p>
      </div>

      <div className="w-full max-w-sm mx-auto p-6 bg-brand-surface rounded-xl shadow-lg border border-gray-700 space-y-4">
        <div>
          <label htmlFor="petrol" className="block text-sm font-medium text-brand-text-secondary">
            Petrol Refilled (Liters)
          </label>
          <input
            id="petrol"
            type="number"
            step="0.1"
            value={petrolRefilled}
            onChange={(e) => setPetrolRefilled(parseFloat(e.target.value))}
            className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-brand-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            min="1.1"
            disabled={isTracking}
          />
        </div>
        <div className="flex gap-4">
            <button
                onClick={isTracking ? stopTracking : handleStart}
                className={`w-full py-3 text-lg font-bold rounded-lg transition ${
                isTracking ? 'bg-brand-accent text-white' : 'bg-brand-primary text-white'
                }`}
            >
                {isTracking ? 'Stop Tracking' : 'Start Trip'}
            </button>
        </div>
        {isTracking && (
             <button
                onClick={handleReserveReached}
                className="w-full py-3 text-lg font-bold rounded-lg transition bg-yellow-600 text-white"
            >
                Reserve Reached
            </button>
        )}
      </div>

       {isTracking && (
        <div className="text-center w-full max-w-sm mx-auto font-orbitron">
            <p className="text-brand-text-secondary text-lg">Distance Covered</p>
            <p className="text-5xl font-bold text-brand-secondary">{distance.toFixed(2)} <span className="text-2xl">km</span></p>
            <p className="text-brand-text-secondary text-lg mt-4">Current Speed</p>
            <p className="text-5xl font-bold text-white">{locationData.speed.toFixed(0)} <span className="text-2xl">km/h</span></p>
        </div>
      )}

      {results && (
        <div className="w-full max-w-sm mx-auto p-6 bg-brand-surface rounded-xl border border-brand-secondary">
          <h3 className="text-xl font-bold text-center mb-4">Calculation Result</h3>
          <div className="space-y-2 text-lg">
            <p><strong>Average Mileage:</strong> <span className="font-bold text-brand-secondary float-right">{results.average.toFixed(2)} km/l</span></p>
            <p><strong>Distance Covered:</strong> <span className="font-bold text-white float-right">{results.distance.toFixed(2)} km</span></p>
            <p><strong>Petrol Consumed:</strong> <span className="font-bold text-white float-right">{(results.petrol - 1).toFixed(2)} L</span></p>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="w-full max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-center mb-4">Recent History</h3>
            <div className="space-y-2">
                {history.map((item, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg text-sm">
                        <p>Avg: <span className="font-bold text-brand-secondary">{item.average.toFixed(1)} km/l</span> | Dist: {item.distance.toFixed(1)} km | Fuel: {item.petrol} L</p>
                    </div>
                ))}
            </div>
        </div>
      )}

      {error && <p className="text-brand-accent text-center">{error}</p>}
    </div>
  );
};

export default FindAverageMode;
