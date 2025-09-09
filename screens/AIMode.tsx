import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useWakeLock } from '../hooks/useLocation';
import { useSpeech } from '../hooks/useSpeech';
import { analyzeDrivingData } from '../services/geminiService';
import { DrivingDataPoint, Bike } from '../types';

interface AIModeProps {
  bike: Bike;
}

const AIMode: React.FC<AIModeProps> = ({ bike }) => {
  const { isTracking, locationData, distance, error, startTracking, stopTracking } = useLocation();
  const { speak, isSpeaking } = useSpeech();
  useWakeLock(isTracking); // Keep screen on while tracking

  const [drivingData, setDrivingData] = useState<DrivingDataPoint[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceAssistantOn, setIsVoiceAssistantOn] = useState(true);

  const lastSpokenDistanceRef = useRef(0);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const overSpeedingAlertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get initial petrol amount from localStorage, similar to DefaultMode
  const [petrolRefilled] = useState<number>(() => {
    try {
        const saved = localStorage.getItem('petrolRefilled');
        return saved ? parseFloat(saved) : 5;
    } catch {
        return 5;
    }
  });

  const remainingRange = Math.max(0, (petrolRefilled * bike.mileage) - distance);

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

  const handleAnalyze = useCallback(async () => {
    if (drivingData.length < 10 || isLoading || isSpeaking) {
      return;
    }
    setIsLoading(true);
    const suggestion = await analyzeDrivingData(drivingData);
    if (suggestion.toLowerCase().includes("keep up")) {
        // Don't show positive reinforcement all the time
    } else {
        setAiSuggestion(suggestion);
        if (isVoiceAssistantOn) {
            speak(suggestion);
        }
    }
    setIsLoading(false);
  }, [drivingData, isLoading, isSpeaking, speak, isVoiceAssistantOn]);

  // Voice alerts and periodic analysis
  useEffect(() => {
    if (isTracking && isVoiceAssistantOn && !isSpeaking) {
      // Distance alert
      const distanceCovered = Math.floor(distance);
      if (distanceCovered > 0 && distanceCovered > lastSpokenDistanceRef.current && distanceCovered % 10 === 0) { // Alert every 10 km
        speak(`You have covered ${distanceCovered} kilometers. Estimated remaining range is ${remainingRange.toFixed(0)} kilometers.`);
        lastSpokenDistanceRef.current = distanceCovered;
      }

      // Rule-based over-speeding alert
      const optimalMax = 55; // Should be dynamic based on bike? For now, hardcoded.
      if (locationData.speed > optimalMax + 5) {
          if (!overSpeedingAlertTimeoutRef.current) {
            overSpeedingAlertTimeoutRef.current = setTimeout(() => {
              if(!isSpeaking) speak("Slow down to improve fuel efficiency.");
            }, 5000); // Trigger alert if speeding for 5 seconds
          }
      } else {
          if (overSpeedingAlertTimeoutRef.current) {
              clearTimeout(overSpeedingAlertTimeoutRef.current);
              overSpeedingAlertTimeoutRef.current = null;
          }
      }
    } else {
        // Clear timeout if tracking stops or voice is off
        if (overSpeedingAlertTimeoutRef.current) {
            clearTimeout(overSpeedingAlertTimeoutRef.current);
            overSpeedingAlertTimeoutRef.current = null;
        }
    }

    // Periodic Gemini analysis
    if (isTracking && isVoiceAssistantOn) {
      if (!analysisIntervalRef.current) {
        analysisIntervalRef.current = setInterval(handleAnalyze, 120000); // Analyze every 2 minutes
      }
    } else {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
        }
        if (overSpeedingAlertTimeoutRef.current) {
            clearTimeout(overSpeedingAlertTimeoutRef.current);
        }
    }

  }, [distance, isTracking, isSpeaking, speak, locationData.speed, handleAnalyze, remainingRange, isVoiceAssistantOn]);

  const handleStartTracking = () => {
    setDrivingData([]);
    setAiSuggestion('');
    lastSpokenDistanceRef.current = 0;
    startTracking();
  }

  const manualAnalyze = async () => {
    if (drivingData.length < 5) {
      setAiSuggestion("Please start tracking and drive for a short while before analyzing.");
      return;
    }
    setIsLoading(true);
    setAiSuggestion('');
    const suggestion = await analyzeDrivingData(drivingData);
    setAiSuggestion(suggestion);
    if (isVoiceAssistantOn) speak(suggestion);
    setIsLoading(false);
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Honda AI Assistant</h1>
        <p className="text-brand-text-secondary">Your real-time driving coach.</p>
      </div>

      <div className="w-full max-w-sm mx-auto flex justify-center items-center gap-4 p-2 bg-brand-surface rounded-full">
        <label htmlFor="voice-toggle" className="text-sm font-medium text-brand-text-secondary">
          Voice Assistant
        </label>
        <button
          id="voice-toggle"
          role="switch"
          aria-checked={isVoiceAssistantOn}
          onClick={() => setIsVoiceAssistantOn(!isVoiceAssistantOn)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${isVoiceAssistantOn ? 'bg-brand-secondary' : 'bg-gray-600'}`}
        >
          <span className="sr-only">Enable Voice Assistant</span>
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isVoiceAssistantOn ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
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
          onClick={manualAnalyze}
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