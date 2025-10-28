import React from 'react';
import GlassCard from '../components/GlassCard';

interface HomePageProps {
  onStartMonitoring: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartMonitoring }) => {
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
              className={`px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg`}
            >
              Start Monitoring
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-3">
             <div className="w-4 h-4 rounded-full bg-gray-300"></div>
            <span className="text-gray-600 font-medium">Ready to monitor from cloud</span>
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