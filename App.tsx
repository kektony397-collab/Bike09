import React, { useState } from 'react';
import { Bike, Screen } from './types';
import { DEFAULT_BIKE } from './constants';
import BottomNav from './components/BottomNav';
import PermissionGate from './components/PermissionGate';
import DefaultMode from './screens/DefaultMode';
import FindAverageMode from './screens/FindAverageMode';
import BikeSearch from './screens/BikeSearch';
import AIMode from './screens/AIMode';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('default');
  const [selectedBike, setSelectedBike] = useState<Bike>(DEFAULT_BIKE);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'default':
        return <DefaultMode bike={selectedBike} />;
      case 'average':
        return <FindAverageMode />;
      case 'search':
        return <BikeSearch selectedBike={selectedBike} setSelectedBike={setSelectedBike} />;
      case 'ai':
        return <AIMode bike={selectedBike} />;
      default:
        return <DefaultMode bike={selectedBike} />;
    }
  };

  return (
    <PermissionGate>
      <div className="min-h-screen bg-brand-bg font-sans pb-24">
        <main>{renderScreen()}</main>
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        <footer className="fixed bottom-16 left-0 right-0 py-1 text-center text-xs text-brand-text-secondary bg-brand-surface z-50">
          Created By Yash K Pathak
        </footer>
      </div>
    </PermissionGate>
  );
};

export default App;