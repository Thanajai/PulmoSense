import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SensorData } from '../types';
import GlassCard from '../components/GlassCard';
import { getInterpretation } from '../services/sensorService';
import { WaveformIcon } from '../components/icons/Icons';

interface DashboardPageProps {
  liveData: SensorData[];
  isMonitoring: boolean;
  onStopMonitoring: () => void;
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

const BreathQualityIndex: React.FC<{ air_quality: number }> = ({ air_quality }) => {
    const { text, color } = getInterpretation(air_quality);
    const percentage = Math.min(100, (air_quality / 600) * 100);
    
    let barColor = 'bg-green-500';
    if (air_quality > 200) barColor = 'bg-yellow-500';
    if (air_quality > 400) barColor = 'bg-red-500';
    
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


const DashboardPage: React.FC<DashboardPageProps> = ({ liveData, isMonitoring, onStopMonitoring }) => {
  const latestData = liveData.length > 0 ? liveData[liveData.length - 1] : null;

  if (!isMonitoring) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <GlassCard>
          <WaveformIcon className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Monitoring Stopped</h2>
          <p className="text-gray-500 mt-2">Go to the Home page to start a new monitoring session.</p>
        </GlassCard>
      </div>
    );
  }
  
  if (!latestData) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <GlassCard>
          <WaveformIcon className="w-16 h-16 text-cyan-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900">Listening for live data...</h2>
          <p className="text-gray-500 mt-2">Waiting for the first reading from the cloud.</p>
        </GlassCard>
      </div>
    );
  }

  const tooltipStyle = { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(0, 0, 0, 0.2)' };

  return (
    <div>
        <div className="flex justify-end mb-4">
            <button 
                onClick={onStopMonitoring}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
                Stop & Save Session
            </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Air Quality Chart */}
            <GlassCard className="lg:col-span-3">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Air Quality (MQ-135)</h2>
                <SensorChart data={liveData} dataKey="air_quality" color="#22d3ee" name="Air Quality (ppm)" />
            </GlassCard>
            
            {/* BQI and Info */}
            <GlassCard className="lg:col-span-1 flex flex-col justify-between">
                <BreathQualityIndex air_quality={latestData.air_quality} />
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Readings</h3>
                    <div className="flex justify-between mt-2 text-gray-600">
                        <span>Air Quality:</span><span className="font-mono text-gray-900">{latestData.air_quality.toFixed(0)} ppm</span>
                    </div>
                    <div className="flex justify-between mt-1 text-gray-600">
                        <span>CO:</span><span className="font-mono text-gray-900">{latestData.co.toFixed(0)} ppm</span>
                    </div>
                    <div className="flex justify-between mt-1 text-gray-600">
                        <span>Alcohol:</span><span className="font-mono text-gray-900">{latestData.alcohol.toFixed(0)} ppm</span>
                    </div>
                </div>
            </GlassCard>

            {/* Other Gas Charts */}
            <GlassCard className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Specific Gas Levels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-48">
                    <h3 className="text-center font-semibold text-sm text-gray-700">Carbon Monoxide (MQ-7)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={liveData}>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="co" name="CO" stroke="#facc15" strokeWidth={2} dot={false} isAnimationActive={false}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-48">
                    <h3 className="text-center font-semibold text-sm text-gray-700">Alcohol (MQ-3)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={liveData}>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="alcohol" name="Alcohol" stroke="#a78bfa" strokeWidth={2} dot={false} isAnimationActive={false}/>
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
    </div>
  );
};

export default DashboardPage;