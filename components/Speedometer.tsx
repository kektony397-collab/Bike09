
import React from 'react';

interface SpeedometerProps {
  speed: number;
  distance: number;
  totalRange: number;
  remainingRange: number;
  petrolLeft: number;
  optimalMin: number;
  optimalMax: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({
  speed,
  distance,
  totalRange,
  remainingRange,
  petrolLeft,
  optimalMin,
  optimalMax,
}) => {
  const isOptimal = speed >= optimalMin && speed <= optimalMax;
  const speedColor = isOptimal ? 'text-brand-secondary' : 'text-brand-text-primary';

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-brand-surface rounded-3xl shadow-2xl border border-gray-700">
      <div className="relative flex items-center justify-center">
        <div className={`font-orbitron text-8xl font-bold transition-colors duration-300 ${speedColor}`}>
          {Math.round(speed)}
        </div>
        <div className="absolute bottom-0 text-2xl font-semibold text-brand-text-secondary">
          km/h
        </div>
      </div>
      <div className="text-center mt-2">
        <p className={`text-sm font-medium ${isOptimal ? 'text-brand-secondary' : 'text-brand-accent'}`}>
          {isOptimal ? 'Optimal Speed' : `Optimal: ${optimalMin}-${optimalMax} km/h`}
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <InfoCard label="Distance" value={`${distance.toFixed(2)} km`} />
        <InfoCard label="Petrol Left" value={`${petrolLeft.toFixed(2)} L`} />
        <InfoCard label="Est. Total Range" value={`${totalRange.toFixed(0)} km`} />
        <InfoCard label="Est. Rem. Range" value={`${remainingRange.toFixed(0)} km`} />
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-800 p-3 rounded-lg">
    <p className="text-sm text-brand-text-secondary">{label}</p>
    <p className="text-xl font-bold text-brand-text-primary font-orbitron">{value}</p>
  </div>
);


export default Speedometer;
