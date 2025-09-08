
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from '../hooks/useLocation';
import { useSpeech } from '../hooks/useSpeech';
import { analyzeDrivingData } from '../services/geminiService';
import { DrivingDataPoint } from '../types';

const AIMode: React.FC = () => {
  const { isTracking, locationData, distance, error, startTracking, stopTracking } = useLocation();
  const { speak, isSpeaking } = useSpeech();
  const [drivingData, setDrivingData] = useState<DrivingDataPoint[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const lastSpokenDistanceRef = useRef(0);

  // Collect driving data when tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setDrivingData(prevData => [...prevData, { speed: locationData.speed, timestamp: Date.now() }]);
      }, 3000); // Record data every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, locationData.speed]);

  // Voice alerts for distance covered
  useEffect(() => {
    if (isTracking && !isSpeaking) {
      const distanceCovered = Math.floor(distance);
      if (distanceCovered > 0 && distanceCovered > lastSpokenDistanceRef.current && distanceCovered % 5 === 0) { // Alert every 5 km
        speak(`You have covered ${distanceCovered} kilometers.`);
        lastSpokenDistanceRef.current = distanceCovered;
      }
    }
  }, [distance, isTracking, isSpeaking, speak]);

  const handleStartTracking = () => {
    setDrivingData([]);
    setAiSuggestion('');
    lastSpokenDistanceRef.current = 0;
    startTracking();
  }

  const handleAnalyze = async () => {
    if (drivingData.length < 5) {
      setAiSuggestion("Please start tracking and drive for a short while before analyzing.");
      return;
    }
    setIsLoading(true);
    setAiSuggestion('');
    const suggestion = await analyzeDrivingData(drivingData);
    setAiSuggestion(suggestion);
    speak(suggestion);
    setIsLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Honda AI Assistant</h1>
        <p className="text-brand-text-secondary">Get real-time feedback to improve your mileage.</p>
      </div>
      
      <div className="w-full max-w-sm mx-auto text-center font-orbitron p-6 bg-brand-surface rounded-xl">
        <p className="text-brand-text-secondary text-lg">Current Speed</p>
        <p className="text-7xl font-bold text-brand-secondary">{locationData.speed.toFixed(0)}</p>
        <p className="text-2xl text-brand-text-secondary">km/h</p>
        <p className="text-brand-text-secondary text-lg mt-4">Distance</p>
        <p className="text-4xl font-bold text-white">{distance.toFixed(2)} km</p>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
        <button
          onClick={isTracking ? stopTracking : handleStartTracking}
          className={`py-3 text-lg font-bold rounded-lg transition ${
            isTracking ? 'bg-brand-accent text-white' : 'bg-brand-primary text-white'
          }`}
        >
          {isTracking ? 'Stop Session' : 'Start Driving Session'}
        </button>
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !isTracking}
          className="py-3 text-lg font-bold rounded-lg transition bg-brand-secondary text-brand-bg disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze My Driving'}
        </button>
      </div>

      {aiSuggestion && (
        <div className="w-full max-w-sm mx-auto p-4 bg-brand-surface rounded-lg border border-brand-secondary">
          <h3 className="font-bold text-brand-secondary mb-2">AI Suggestion</h3>
          <p className="text-brand-text-primary">{aiSuggestion}</p>
        </div>
      )}
      
      {error && <p className="text-brand-accent text-center">{error}</p>}
    </div>
  );
};

export default AIMode;
