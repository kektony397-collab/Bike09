
import { useState, useEffect, useRef, useCallback } from 'react';
import { LocationData } from '../types';

// Haversine formula to calculate distance between two lat/lon points
const haversineDistance = (coords1: GeolocationCoordinates, coords2: GeolocationCoordinates): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in km
};


export const useLocation = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [locationData, setLocationData] = useState<LocationData>({ speed: 0, coords: null });
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<GeolocationPosition | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    
    lastPositionRef.current = null;
    setDistance(0);
    setIsTracking(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const speedMps = position.coords.speed || 0;
        const speedKph = speedMps * 3.6;
        
        setLocationData({
          speed: speedKph,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });

        if (lastPositionRef.current) {
          const newDistance = haversineDistance(lastPositionRef.current.coords, position.coords);
          setDistance((prevDistance) => prevDistance + newDistance);
        }
        lastPositionRef.current = position;
      },
      (err) => {
        setError(`Location Error: ${err.message}`);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setLocationData(prev => ({ ...prev, speed: 0 }));
  }, []);

  const resetDistance = useCallback(() => {
    setDistance(0);
    lastPositionRef.current = null;
  }, []);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { isTracking, locationData, distance, error, startTracking, stopTracking, resetDistance };
};
