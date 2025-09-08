
import React, { useState, useMemo } from 'react';
import { Bike } from '../types';
import { BIKE_MODELS } from '../constants';
import DefaultMode from './DefaultMode';

const BikeSearch: React.FC<{
  selectedBike: Bike;
  setSelectedBike: (bike: Bike) => void;
}> = ({ selectedBike, setSelectedBike }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'search' | 'dashboard'>('search');

  const filteredBikes = useMemo(() => {
    return BIKE_MODELS.filter(bike => 
      bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bike.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelectBike = (bike: Bike) => {
    setSelectedBike(bike);
    setView('dashboard');
  };

  if (view === 'dashboard') {
    return (
      <div>
        <button 
          onClick={() => setView('search')}
          className="m-4 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          ← Choose Another Bike
        </button>
        <DefaultMode bike={selectedBike} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Select Your Bike</h1>
      <div className="mb-4 sticky top-4 bg-brand-bg z-10 py-2">
        <input
          type="text"
          placeholder="Search for bike or manufacturer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-brand-surface border border-gray-600 rounded-md shadow-sm py-2 px-3 text-brand-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div className="space-y-3">
        {filteredBikes.map(bike => (
          <div
            key={bike.id}
            onClick={() => handleSelectBike(bike)}
            className="p-4 bg-brand-surface rounded-lg shadow-md border border-gray-700 hover:border-brand-primary cursor-pointer transition-all"
          >
            <h2 className="font-bold text-lg text-brand-text-primary">{bike.name}</h2>
            <p className="text-sm text-brand-text-secondary">{bike.manufacturer}</p>
            <p className="text-right font-semibold text-brand-secondary">{bike.mileage} km/l</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BikeSearch;
