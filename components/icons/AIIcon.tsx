
import React from 'react';

export const AIIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"></path><rect x="4" y="8" width="8" height="12" rx="2"></rect>
    <path d="M12 12h4"></path><path d="M12 16h4"></path><path d="M16 8v12"></path>
  </svg>
);
