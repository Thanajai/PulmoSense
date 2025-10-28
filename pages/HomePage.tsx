
import React from 'react';
import GlassCard from '../components/GlassCard';
import { ConnectionStatus } from '../types';

interface HomePageProps {
  connectionStatus: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ connectionStatus, onConnect, onDisconnect }) => {
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>;
      case 'connecting':
        return <div className="w-4 h-4 rounded-full bg-yellow-500 animate-spin"></div>;
      case 'disconnected':
      default:
        return <div className="w-4 h-4 rounded-full bg-red-500"></div>;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return "Device Connected";
      case 'connecting':
        return "Connecting...";
      case 'disconnected':
      default:
        return "Device Disconnected";
    }
  };

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
              onClick={isConnected ? onDisconnect : onConnect}
              disabled={isConnecting}
              className={`px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105
                ${
                  isConnected
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-cyan-500 hover:bg-cyan-600'
                }
                text-white shadow-lg ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isConnecting ? 'Pairing...' : isConnected ? 'Disconnect Device' : 'Connect Device'}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-3">
            {getStatusIndicator()}
            <span className="text-gray-600 font-medium">{getStatusText()}</span>
          </div>
        </div>
      </GlassCard>
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        © PulmoSense Technologies 2025 – Empowering Preventive Healthcare.
      </footer>
    </div>
  );
};

export default HomePage;
