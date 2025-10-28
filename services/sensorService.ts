
import { SensorData, Session } from '../types';

// Mock data generation
export const generateDataPoint = (lastData?: SensorData): SensorData => {
  const base = {
    air_quality: 150, // MQ-135 base for clean air
    alcohol: 10,      // MQ-3 base
    co: 5,            // MQ-7 base
    temperature: 28,
    humidity: 55,
  };

  const fluctuation = (value: number, range: number) => {
    return value + (Math.random() - 0.5) * range;
  };

  const last = lastData || base;

  return {
    timestamp: new Date().toISOString(),
    air_quality: Math.max(50, Math.min(600, fluctuation(last.air_quality, 50))),
    alcohol: Math.max(0, Math.min(200, fluctuation(last.alcohol, 10))),
    co: Math.max(0, Math.min(100, fluctuation(last.co, 5))),
    temperature: parseFloat(fluctuation(last.temperature, 1).toFixed(1)),
    humidity: Math.max(30, Math.min(80, fluctuation(last.humidity, 5))),
  };
};

// Local storage helpers
const SESSIONS_KEY = 'pulmosense_sessions';

export const saveSession = (session: Session): void => {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getSessions = (): Session[] => {
  const savedSessions = localStorage.getItem(SESSIONS_KEY);
  if (savedSessions) {
    const parsed = JSON.parse(savedSessions);
    // Revive Date objects
    return parsed.map((s: any) => ({
      ...s,
      startTime: new Date(s.startTime),
      endTime: s.endTime ? new Date(s.endTime) : null,
    }));
  }
  return [];
};

export const clearSessions = (): void => {
  localStorage.removeItem(SESSIONS_KEY);
};

export const getInterpretation = (air_quality: number): { text: string; color: string } => {
  if (air_quality < 200) return { text: "Normal breath quality", color: "text-green-400" };
  if (air_quality >= 200 && air_quality <= 400) return { text: "Slight elevation detected", color: "text-yellow-400" };
  return { text: "High impurity levels detected", color: "text-red-400" };
};