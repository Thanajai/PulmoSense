// FIX: Updated Firebase import path from 'firebase/database' to '@firebase/database' to resolve module export errors.
import { ref, onValue, off } from '@firebase/database';
import { rtdb } from '../firebaseConfig';
import { SensorData, ConnectionStatus } from '../types';

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
      const rawData = snapshot.val();
      // Validate the structure of the raw data from Firebase
      if (rawData && typeof rawData.mq135 === 'number' && typeof rawData.mq7 === 'number' && typeof rawData.mq3 === 'number') {
        // Map raw data to the SensorData interface used by the app
        const mappedData: SensorData = {
          timestamp: new Date().toISOString(),
          air_quality: rawData.mq135,
          co: rawData.mq7,
          alcohol: rawData.mq3,
        };
        onData(mappedData);
      } else if (rawData) { // Only warn if rawData is not null/undefined
        console.warn('Received malformed or incomplete sensor data:', rawData);
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