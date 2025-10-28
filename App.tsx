import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import { Page, SensorData, Session, User, ConnectionStatus } from './types';
import { saveSession, getSessions, clearSessions } from './services/sensorService';
import { auth } from './firebaseConfig';
// FIX: Updated Firebase import path from 'firebase/auth' to '@firebase/auth' to resolve module export error.
import { onAuthStateChanged } from '@firebase/auth';
import liveDataService from './services/liveDataService';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [user, setUser] = useState<User | null>(null);
  const [liveData, setLiveData] = useState<SensorData[]>([]);
  const [currentSession, setCurrentSession] = useState<Omit<Session, 'id'> | null>(null);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // Handle Firebase auth state and RTDB connection status globally
  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const sessions = await getSessions(currentUser.uid);
        setAllSessions(sessions);
      } else {
        setAllSessions([]);
      }
    });

    const connectionUnsubscribe = liveDataService.subscribeToConnectionStatus(setConnectionStatus);

    return () => {
      authUnsubscribe();
      connectionUnsubscribe();
    };
  }, []);
  
  // Handle live data subscription only when monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const dataUnsubscribe = liveDataService.subscribeToData((dataPoint) => {
      setLiveData(prevData => {
        const updatedData = [...prevData, dataPoint];
        // Keep the array length manageable to prevent performance degradation
        return updatedData.length > 50 ? updatedData.slice(-50) : updatedData;
      });
    });

    // Cleanup subscription when monitoring stops or component unmounts
    return () => dataUnsubscribe();
  }, [isMonitoring]);
  
  const startMonitoring = () => {
      if (connectionStatus !== 'connected') {
        alert('Cannot start monitoring. Please check your internet connection.');
        return;
      }
      const newSession: Omit<Session, 'id'> = {
        startTime: new Date(),
        endTime: null,
        data: [],
        comment: '',
      };
      setCurrentSession(newSession);
      setLiveData([]); // Clear previous live data
      setIsMonitoring(true);
      setActivePage(Page.Dashboard);
  };
  
  const stopMonitoring = useCallback(async () => {
    setIsMonitoring(false);
    if (currentSession && liveData.length > 0 && user) {
      const finalSession = {
        ...currentSession,
        endTime: new Date(),
        data: liveData,
        comment: 'Session completed.',
      };
      await saveSession(finalSession, user.uid);
      const sessions = await getSessions(user.uid);
      setAllSessions(sessions);
    }
    setCurrentSession(null);
  }, [currentSession, liveData, user]);

  const handleClearHistory = async () => {
    if (user) {
      await clearSessions(user.uid);
      setAllSessions([]);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case Page.Home:
        return <HomePage onStartMonitoring={startMonitoring} connectionStatus={connectionStatus} />;
      case Page.Dashboard:
        return <DashboardPage liveData={liveData} isMonitoring={isMonitoring} onStopMonitoring={stopMonitoring} connectionStatus={connectionStatus} />;
      case Page.History:
        return <HistoryPage sessions={allSessions} clearHistory={handleClearHistory} user={user} />;
      case Page.Profile:
        return <ProfilePage user={user} />;
      case Page.Support:
        return <SupportPage />;
      default:
        return <HomePage onStartMonitoring={startMonitoring} connectionStatus={connectionStatus} />;
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
