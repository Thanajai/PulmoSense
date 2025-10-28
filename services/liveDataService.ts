// FIX: Updated Firebase import path from 'firebase/database' to '@firebase/database' to resolve module export errors.
import { ref, onValue, off } from '@firebase/database';
import { rtdb } from '../firebaseConfig';
import { SensorData, ConnectionStatus } from '../types';

// Type guard to validate the structure of sensor data from Firebase
function isSensorData(data: any): data is SensorData {
  return (
    data &&
    typeof data.timestamp === 'string' &&
    typeof data.air_quality === 'number' &&
    typeof data.co === 'number' &&
    typeof data.alcohol === 'number' &&
    typeof data.temperature === 'number' &&
    typeof data.humidity === 'number'
  );
}

const LIVE_DATA_PATH = 'voc_readings/latest';
const CONNECTION_STATUS_PATH = '.info/connected';

const liveDataService = {
  /**
   * Subscribes to the live sensor data stream from Firebase Realtime Database.
   * @param onData Callback function to handle incoming parsed sensor data.
   * @returns An unsubscribe function to clean up the listener.
   */
  subscribeToData(onData: (data: SensorData) => void): () => void {
    const liveDataRef = ref(rtdb, LIVE_DATA_PATH);
    const listener = onValue(liveDataRef, (snapshot) => {
      const dataPoint = snapshot.val();
      if (dataPoint) {
        // Add a client-side timestamp if one isn't provided, for robustness.
        if (!dataPoint.timestamp) {
            dataPoint.timestamp = new Date().toISOString();
        }

        // Validate data structure before processing to prevent runtime errors.
        if (isSensorData(dataPoint)) {
            onData(dataPoint);
        } else {
            console.warn('Received malformed sensor data:', dataPoint);
        }
      }
    });

    return () => off(liveDataRef, 'value', listener);
  },

  /**
   * Subscribes to the Firebase Realtime Database connection status.
   * @param onStatusChange Callback function to report changes in connection status.
   * @returns An unsubscribe function to clean up the listener.
   */
  subscribeToConnectionStatus(onStatusChange: (status: ConnectionStatus) => void): () => void {
    const connectionRef = ref(rtdb, CONNECTION_STATUS_PATH);
    const listener = onValue(connectionRef, (snapshot) => {
        const isConnected = !!snapshot.val();
        onStatusChange(isConnected ? 'connected' : 'disconnected');
    });

    return () => off(connectionRef, 'value', listener);
  }
};

export default liveDataService;