
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SensorData, ConnectionStatus } from '../types';
import GlassCard from '../components/GlassCard';
import { getInterpretation } from '../services/sensorService';
import { WaveformIcon } from '../components/icons/Icons';

interface DashboardPageProps {
  liveData: SensorData[];
  connectionStatus: ConnectionStatus;
}

const SensorChart: React.FC<{ data: SensorData[]; dataKey: keyof SensorData; color: string; name: string }> = ({ data, dataKey, color, name }) => {
  const axisColor = '#6b7280';
  const gridColor = 'rgba(0, 0, 0, 0.1)';
  const tooltipBg = 'rgba(255, 255, 255, 0.9)';
  const tooltipBorder = 'rgba(0, 0, 0, 0.2)';
  const tooltipColor = '#1f2937';
    
  return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} stroke={axisColor} fontSize={12} />
          <YAxis stroke={axisColor} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              color: tooltipColor,
            }}
          />
          <Legend />
          <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
  )
};

const BreathQualityIndex: React.FC<{ voc: number }> = ({ voc }) => {
    const { text, color } = getInterpretation(voc);
    const percentage = Math.min(100, (voc / 600) * 100);
    
    let barColor = 'bg-green-500';
    if (voc > 200) barColor = 'bg-yellow-500';
    if (voc > 400) barColor = 'bg-red-500';
    
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Breath Quality Index</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div className={`${barColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className={`mt-2 font-medium ${color}`}>{text}</p>
        </div>
    );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ liveData, connectionStatus }) => {
  const latestData = liveData.length > 0 ? liveData[liveData.length - 1] : null;

  if (connectionStatus !== 'connected') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <GlassCard>
          <WaveformIcon className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Dashboard is Offline</h2>
          <p className="text-gray-500 mt-2">Please connect your PulmoSense device on the Home page to see live data.</p>
        </GlassCard>
      </div>
    );
  }
  
  if (!latestData) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <GlassCard>
          <WaveformIcon className="w-16 h-16 text-cyan-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900">Waiting for data...</h2>
          <p className="text-gray-500 mt-2">Device connected. Initializing data stream.</p>
        </GlassCard>
      </div>
    );
  }

  const tooltipStyle = { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(0, 0, 0, 0.2)' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main VOC Chart */}
      <GlassCard className="lg:col-span-3">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Volatile Organic Compounds (VOC)</h2>
        <SensorChart data={liveData} dataKey="voc" color="#22d3ee" name="VOC (ppm)" />
      </GlassCard>
      
      {/* BQI and Info */}
      <GlassCard className="lg:col-span-1 flex flex-col justify-between">
        <BreathQualityIndex voc={latestData.voc} />
         <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Readings</h3>
            <div className="flex justify-between mt-2 text-gray-600">
                <span>VOC:</span><span className="font-mono text-gray-900">{latestData.voc.toFixed(0)} ppm</span>
            </div>
             <div className="flex justify-between mt-1 text-gray-600">
                <span>CO₂:</span><span className="font-mono text-gray-900">{latestData.co2.toFixed(0)} ppm</span>
            </div>
            <div className="flex justify-between mt-1 text-gray-600">
                <span>NH₃:</span><span className="font-mono text-gray-900">{latestData.nh3.toFixed(0)} ppm</span>
            </div>
         </div>
      </GlassCard>

      {/* Other Charts */}
      <GlassCard className="lg:col-span-2">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Other Gas Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveData}>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="co2" name="CO₂" stroke="#a78bfa" strokeWidth={2} dot={false} isAnimationActive={false}/>
                </LineChart>
             </ResponsiveContainer>
          </div>
          <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveData}>
                     <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="nh3" name="NH₃" stroke="#facc15" strokeWidth={2} dot={false} isAnimationActive={false}/>
                </LineChart>
             </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
      
      <GlassCard className="lg:col-span-3">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Environmental Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SensorChart data={liveData} dataKey="temperature" color="#fb923c" name="Temperature (°C)" />
            <SensorChart data={liveData} dataKey="humidity" color="#60a5fa" name="Humidity (%)" />
        </div>
      </GlassCard>

    </div>
  );
};

export default DashboardPage;
