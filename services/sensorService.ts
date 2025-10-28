
import { SensorData, Session } from '../types';

// Mock data generation
export const generateDataPoint = (lastData?: SensorData): SensorData => {
  const base = {
    voc: 200,
    co2: 400,
    nh3: 20,
    temperature: 28,
    humidity: 55,
  };

  const fluctuation = (value: number, range: number) => {
    return value + (Math.random() - 0.5) * range;
  };

  const last = lastData || base;

  return {
    timestamp: new Date().toISOString(),
    voc: Math.max(50, Math.min(600, fluctuation(last.voc, 50))),
    co2: Math.max(300, Math.min(1000, fluctuation(last.co2, 100))),
    nh3: Math.max(5, Math.min(100, fluctuation(last.nh3, 10))),
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

export const getInterpretation = (voc: number): { text: string; color: string } => {
  if (voc < 200) return { text: "Normal breath quality", color: "text-green-400" };
  if (voc >= 200 && voc <= 400) return { text: "Slight elevation detected", color: "text-yellow-400" };
  return { text: "High VOC levels detected", color: "text-red-400" };
};
