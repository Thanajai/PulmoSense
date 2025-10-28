import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import { Page, SensorData, Session, User } from './types';
import { saveSession, getSessions, clearSessions } from './services/sensorService';
import { auth, rtdb } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, off } from 'firebase/database';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [user, setUser] = useState<User | null>(null);
  const [liveData, setLiveData] = useState<SensorData[]>([]);
  const [currentSession, setCurrentSession] = useState<Omit<Session, 'id'> | null>(null);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Handle Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const sessions = await getSessions(currentUser.uid);
        setAllSessions(sessions);
      } else {
        setAllSessions([]);
      }
    });
    return () => unsubscribe();
  }, []);
  
  // Handle live data from Realtime Database
  useEffect(() => {
    if (activePage !== Page.Dashboard || !isMonitoring) {
        return;
    }
    
    const liveDataRef = ref(rtdb, 'live_data'); // Assumes data is at '/live_data' path
    const unsubscribe = onValue(liveDataRef, (snapshot) => {
      const dataPoint = snapshot.val();
      if (dataPoint) {
        // Add a client-side timestamp if one isn't provided
        if (!dataPoint.timestamp) {
            dataPoint.timestamp = new Date().toISOString();
        }
        setLiveData(prevData => {
          const updatedData = [...prevData, dataPoint];
          // Keep the array length manageable
          return updatedData.length > 50 ? updatedData.slice(1) : updatedData;
        });
      }
    });

    // Cleanup listener on component unmount or page change
    return () => off(liveDataRef, 'value', unsubscribe);
  }, [activePage, isMonitoring]);
  
  const startMonitoring = () => {
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
        return <HomePage onStartMonitoring={startMonitoring} />;
      case Page.Dashboard:
        return <DashboardPage liveData={liveData} isMonitoring={isMonitoring} onStopMonitoring={stopMonitoring} />;
      case Page.History:
        return <HistoryPage sessions={allSessions} clearHistory={handleClearHistory} user={user} />;
      case Page.Profile:
        return <ProfilePage user={user} />;
      case Page.Support:
        return <SupportPage />;
      default:
        return <HomePage onStartMonitoring={startMonitoring} />;
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