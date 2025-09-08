
import React, { useState, useEffect, useCallback } from 'react';

interface PermissionGateProps {
  children: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ children }) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'prompt' | 'checking'>('checking');

  const checkPermission = useCallback(async () => {
      if (!navigator.permissions) {
          // Fallback for older browsers
          setPermissionStatus('granted'); // Assume granted and let the API call fail if not
          return;
      }
      try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionStatus(result.state);
      } catch (error) {
          console.error("Permission query failed", error);
          setPermissionStatus('prompt'); // Fallback to prompt
      }
  }, []);


  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const requestPermission = () => {
    navigator.geolocation.getCurrentPosition(
      () => checkPermission(),
      () => checkPermission()
    );
  };
  
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
        await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (permissionStatus === 'checking') {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-bg">
        <p className="text-brand-text-secondary">Checking permissions...</p>
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
