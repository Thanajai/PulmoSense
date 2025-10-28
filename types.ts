
export interface SensorData {
  timestamp: string;
  voc: number;
  co2: number;
  nh3: number;
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
