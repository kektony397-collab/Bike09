
import React from 'react';
import { Screen } from '../types';
import { SpeedometerIcon } from './icons/SpeedometerIcon';
import { FuelIcon } from './icons/FuelIcon';
import { SearchIcon } from './icons/SearchIcon';
import { AIIcon } from './icons/AIIcon';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-brand-secondary';
  const inactiveClasses = 'text-brand-text-secondary hover:text-brand-text-primary';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-1/4 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-brand-surface border-t border-gray-700 flex justify-around items-center z-50">
      <NavItem
        label="Bike Mode"
        icon={<SpeedometerIcon className="w-6 h-6" />}
        isActive={activeScreen === 'default'}
        onClick={() => setActiveScreen('default')}
      />
      <NavItem
        label="Find Average"
        icon={<FuelIcon className="w-6 h-6" />}
        isActive={activeScreen === 'average'}
        onClick={() => setActiveScreen('average')}
      />
      <NavItem
        label="Search"
        icon={<SearchIcon className="w-6 h-6" />}
        isActive={activeScreen === 'search'}
        onClick={() => setActiveScreen('search')}
      />
      <NavItem
        label="Honda AI"
        icon={<AIIcon className="w-6 h-6" />}
        isActive={activeScreen === 'ai'}
        onClick={() => setActiveScreen('ai')}
      />
    </div>
  );
};

export default BottomNav;
