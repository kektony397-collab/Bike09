
export interface Bike {
  id: number;
  name: string;
  manufacturer: string;
  mileage: number; // in km/l
}

export type Screen = 'default' | 'average' | 'search' | 'ai';

export interface LocationData {
  speed: number; // in km/h
  coords: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface DrivingDataPoint {
    speed: number;
    timestamp: number;
}
