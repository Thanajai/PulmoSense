import React from 'react';
import { Session, User } from '../types';
import GlassCard from '../components/GlassCard';
import { getInterpretation } from '../services/sensorService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';


interface HistoryPageProps {
  sessions: Session[];
  clearHistory: () => void;
  user: User | null;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ sessions, clearHistory, user }) => {

  const getAverage = (data: any[], key: string): number => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    return (sum / data.length);
  };
  
  const trendData = sessions.map(session => ({
    date: new Date(session.startTime).toLocaleDateString(),
    avg_air_quality: getAverage(session.data, 'air_quality'),
  })).slice(0, 10).reverse(); // show last 10 sessions trend
  
  const axisColor = '#6b7280';
  const gridColor = 'rgba(0, 0, 0, 0.1)';
  const tooltipBg = 'rgba(255, 255, 255, 0.9)';
  const tooltipBorder = 'rgba(0, 0, 0, 0.2)';
  const tooltipColor = '#1f2937';
  const tooltipStyle = { backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor };

  if (!user) {
    return (
      <GlassCard>
        <p className="text-center text-gray-500 py-8">Please sign in on the Profile page to view your session history.</p>
      </GlassCard>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-poppins text-gray-900">Session History</h1>
        {sessions.length > 0 && (
           <button onClick={clearHistory} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
             Clear History
           </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <GlassCard>
          <p className="text-center text-gray-500 py-8">No saved sessions yet. Start monitoring to record your first session.</p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
            <GlassCard>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Air Quality Trend Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="date" stroke={axisColor} fontSize={12} />
                        <YAxis stroke={axisColor} fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Line type="monotone" dataKey="avg_air_quality" name="Average Air Quality (ppm)" stroke="#22d3ee" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </GlassCard>
            <GlassCard>
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-300">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Avg. Air Quality</th>
                        <th className="p-4">Interpretation</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sessions.map(session => {
                        const avgAirQuality = getAverage(session.data, 'air_quality');
                        const interpretation = getInterpretation(avgAirQuality);
                        const duration = session.endTime ? ((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000).toFixed(0) + 's' : 'In progress';

                        return (
                        <tr key={session.id} className="border-b border-gray-200 hover:bg-gray-100/50">
                            <td className="p-4">{new Date(session.startTime).toLocaleString()}</td>
                            <td className="p-4">{duration}</td>
                            <td className={`p-4 font-mono ${interpretation.color}`}>{avgAirQuality.toFixed(1)} ppm</td>
                            <td className={`p-4 ${interpretation.color}`}>{interpretation.text}</td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                </div>
            </GlassCard>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;