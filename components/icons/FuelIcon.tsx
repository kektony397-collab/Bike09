
import React from 'react';

export const FuelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"></line>
    <path d="M4 22V5.23a2 2 0 0 1 1.05-1.79l5-2.89a2 2 0 0 1 1.9 0l5 2.89A2 2 0 0 1 18 5.23V22"></path>
    <path d="M10 9h4"></path><path d="M10 13h4"></path><path d="M10 17h4"></path>
  </svg>
);
