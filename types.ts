
export interface SensorData {
  timestamp: string;
  air_quality: number; // from MQ-135
  alcohol: number;     // from MQ-3
  co: number;          // from MQ-7
  temperature: number;
  humidity: number;
}

export interface Session {
  id: number;
  startTime: Date;
  endTime: Date | null;
  data: SensorData[];
  comment: string;
}

export enum Page {
  Home = 'Home',
  Dashboard = 'Dashboard',
  History = 'History',
  Profile = 'Profile',
  Support = 'Support'
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';