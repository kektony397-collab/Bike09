import React, { useState, useEffect, useCallback } from 'react';

interface PermissionGateProps {
  children: React.ReactNode;
}

type PermissionStatus = 'checking' | 'prompt' | 'granted' | 'denied' | 'unsupported';

const PermissionGate: React.FC<PermissionGateProps> = ({ children }) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('checking');

  const checkPermission = useCallback(async () => {
      if (!navigator.geolocation) {
          setPermissionStatus('unsupported');
          return;
      }
      if (!navigator.permissions) {
          // Fallback for older browsers that have geolocation but not permissions API
          setPermissionStatus('prompt');
          return;
      }
      try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionStatus(result.state);
          // Listen for changes in permission status
          result.onchange = () => {
              setPermissionStatus(result.state);
          };
      } catch (error) {
          console.error("Permission query failed. Falling back to prompt.", error);
          setPermissionStatus('prompt'); // Fallback to prompt if query fails
      }
  }, []);


  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const requestPermission = () => {
    if (!navigator.geolocation) {
        checkPermission(); // Should set state to 'unsupported'
        return;
    }
    navigator.geolocation.getCurrentPosition(
      () => checkPermission(), // on success, re-check status
      () => checkPermission(), // on error (e.g., user denies), re-check status
      { timeout: 10000, enableHighAccuracy: true }
    );
  };
  
  const requestNotificationPermission = useCallback(async () => {
    try {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    } catch (err) {
        console.warn('Could not request notification permission.', err);
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  if (permissionStatus === 'checking') {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-bg">
        <p className="text-brand-text-secondary">Checking permissions...</p>
      </div>
    );
  }
    
  if (permissionStatus === 'unsupported') {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-brand-bg text-center p-4">
            <h2 className="text-2xl font-bold mb-4 text-brand-text-primary">Feature Not Available</h2>
            <p className="mb-6 text-brand-text-secondary">
                This application requires Geolocation, which is not supported by your browser or is disabled. 
                Please use a modern browser like Chrome or Firefox on a secure (HTTPS) connection.
            </p>
        </div>
    );
  }

  if (permissionStatus === 'granted') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-brand-bg text-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-brand-text-primary">Location Access Required</h2>
      <p className="mb-6 text-brand-text-secondary">
        Bike Advance needs access to your location to track your speed, distance, and provide real-time stats.
      </p>
      <button
        onClick={requestPermission}
        className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
      >
        {permissionStatus === 'denied' ? 'Enable Location in Settings' : 'Grant Permission'}
      </button>
      {permissionStatus === 'denied' && (
        <p className="mt-4 text-sm text-brand-accent">
          You have denied location access. Please enable it in your browser settings to use this app.
        </p>
      )}
    </div>
  );
};

export default PermissionGate;
