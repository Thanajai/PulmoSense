import React from 'react';
import GlassCard from '../components/GlassCard';
import { ConnectionStatus } from '../types';

interface HomePageProps {
  onStartMonitoring: () => void;
  connectionStatus: ConnectionStatus;
}

const ConnectionIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  let color = 'bg-yellow-400';
  let text = 'Connecting to cloud...';
  let pulse = true;

  if (status === 'connected') {
    color = 'bg-green-500';
    text = 'Ready to monitor from cloud';
    pulse = false;
  } else if (status === 'disconnected') {
    color = 'bg-red-500';
    text = 'Disconnected from cloud';
    pulse = false;
  }

  return (
    <div className="mt-8 flex items-center justify-center space-x-3">
      <div className={`w-4 h-4 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`}></div>
      <span className="text-gray-600 font-medium">{text}</span>
    </div>
  );
};


const HomePage: React.FC<HomePageProps> = ({ onStartMonitoring, connectionStatus }) => {
  const isReady = connectionStatus === 'connected';

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <GlassCard className="max-w-2xl w-full">
        <div className="p-8">
          <h1 className="text-5xl md:text-6xl font-bold font-poppins text-gray-900">
            Pulmo<span className="text-cyan-500">Sense</span> Lite
          </h1>
          <p className="mt-4 text-2xl text-cyan-700/80 font-poppins">Your Breath, Your Health.</p>
          <p className="mt-6 text-lg text-gray-600">
            Visualize your lung health in real time using safe breath analysis.
          </p>
          
          <div className="mt-12">
            <button
              onClick={onStartMonitoring}
              disabled={!isReady}
              aria-disabled={!isReady}
              className={`px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 ${
                isReady
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              Start Monitoring
            </button>
          </div>

          <ConnectionIndicator status={connectionStatus} />
        </div>
      </GlassCard>
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        © PulmoSense Technologies 2025 – Empowering Preventive Healthcare.
      </footer>
    </div>
  );
};

export default HomePage;
