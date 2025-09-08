
import { Bike } from './types';

export const DEFAULT_BIKE: Bike = {
  id: 1,
  name: 'Dream Yuga (2014)',
  manufacturer: 'Honda',
  mileage: 44, // Adjusted for 2.5 years since overhaul
};

export const BIKE_MODELS: Bike[] = [
  DEFAULT_BIKE,
  { id: 2, name: 'Splendor Plus', manufacturer: 'Hero', mileage: 65 },
  { id: 3, name: 'Pulsar 150', manufacturer: 'Bajaj', mileage: 45 },
  { id: 4, name: 'FZ-S FI', manufacturer: 'Yamaha', mileage: 45 },
  { id: 5, name: 'Classic 350', manufacturer: 'Royal Enfield', mileage: 35 },
  { id: 6, name: 'Activa 6G', manufacturer: 'Honda', mileage: 50 },
  { id: 7, name: 'HF Deluxe', manufacturer: 'Hero', mileage: 70 },
  { id: 8, name: 'Platina 110', manufacturer: 'Bajaj', mileage: 70 },
  { id: 9, name: 'MT-15', manufacturer: 'Yamaha', mileage: 48 },
  { id: 10, name: 'Bullet 350', manufacturer: 'Royal Enfield', mileage: 37 },
  { id: 11, name: 'Shine', manufacturer: 'Honda', mileage: 55 },
  { id: 12, name: 'Passion Pro', manufacturer: 'Hero', mileage: 60 },
  { id: 13, name: 'Avenger Cruise 220', manufacturer: 'Bajaj', mileage: 40 },
  { id: 14, name: 'R15 V4', manufacturer: 'Yamaha', mileage: 40 },
  { id: 15, name: 'Himalayan', manufacturer: 'Royal Enfield', mileage: 30 },
  { id: 16, name: 'Dio', manufacturer: 'Honda', mileage: 48 },
  { id: 17, name: 'Glamour', manufacturer: 'Hero', mileage: 55 },
  { id: 18, name: 'Dominar 400', manufacturer: 'Bajaj', mileage: 27 },
  { id: 19, name: 'Unicorn', manufacturer: 'Honda', mileage: 50 },
  { id: 20, name: 'Chetak', manufacturer: 'Bajaj', mileage: 90 }, // Assuming electric range in km
];
