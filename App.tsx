
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import { Page, SensorData, Session, ConnectionStatus } from './types';
import { saveSession, getSessions, clearSessions } from './services/sensorService';
import webSerialService from './services/webSerialService';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [liveData, setLiveData] = useState<SensorData[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [allSessions, setAllSessions] = useState<Session[]>([]);

  useEffect(() => {
    setAllSessions(getSessions());
  }, []);

  const handleDisconnect = useCallback(() => {
    webSerialService.disconnect();
    setConnectionStatus('disconnected');
    
    if (currentSession && liveData.length > 0) {
      const finalSession = {
        ...currentSession,
        endTime: new Date(),
        data: liveData,
        comment: 'Session completed.',
      };
      saveSession(finalSession);
      setAllSessions(getSessions());
    }
    setCurrentSession(null);
  }, [currentSession, liveData]);

  const handleConnect = useCallback(async () => {
    setConnectionStatus('connecting');
    try {
      await webSerialService.connect(
        // onData callback
        (dataPoint: SensorData) => {
          setLiveData(prevData => {
            const updatedData = [...prevData, dataPoint];
            if (updatedData.length > 50) {
              updatedData.shift();
            }
            return updatedData;
          });
        },
        // onStatusChange callback
        (status: ConnectionStatus) => {
            if (status === 'disconnected') {
                // This is called automatically when the device is unplugged
                handleDisconnect(); 
            }
        }
      );

      // If connect() resolves without error, connection was successful
      setConnectionStatus('connected');
      const newSession: Session = {
        id: Date.now(),
        startTime: new Date(),
        endTime: null,
        data: [],
        comment: '',
      };
      setCurrentSession(newSession);
      setLiveData([]); // Clear data from any previous session

    } catch (error) {
      // Gracefully handle user cancellation of the port selection dialog
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        console.log('User cancelled the port selection dialog.');
      } else {
        // Handle other, unexpected connection errors
        console.error('Connection failed:', error);
        alert(`Connection failed: ${(error as Error).message}. Please ensure you are using a compatible browser (like Chrome or Edge) and the device is properly connected.`);
      }
      setConnectionStatus('disconnected');
    }
  }, [handleDisconnect]);

  const renderPage = () => {
    switch (activePage) {
      case Page.Home:
        return <HomePage connectionStatus={connectionStatus} onConnect={handleConnect} onDisconnect={handleDisconnect} />;
      case Page.Dashboard:
        return <DashboardPage liveData={liveData} connectionStatus={connectionStatus} />;
      case Page.History:
        return <HistoryPage sessions={allSessions} clearHistory={() => { clearSessions(); setAllSessions([]); }} />;
      case Page.Profile:
        return <ProfilePage />;
      case Page.Support:
        return <SupportPage />;
      default:
        return <HomePage connectionStatus={connectionStatus} onConnect={handleConnect} onDisconnect={handleDisconnect} />;
    }
  };

  return (
    <div className={`flex min-h-screen bg-gray-100 text-gray-800`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-20 md:ml-64 transition-all duration-300">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
