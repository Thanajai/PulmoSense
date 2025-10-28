
import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';

interface ProfilePageProps {
}

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const [profile, setProfile] = useState({
    name: 'Alex Doe',
    age: 34,
    smokingStatus: 'non-smoker',
    region: 'North America',
    units: 'metric',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const InputField: React.FC<{ label: string; name: string; value: string | number; type?: string; onChange: any }> = ({ label, name, value, type = 'text', onChange }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold font-poppins text-gray-900 mb-6">Profile & Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h2>
          <div className="space-y-4">
            <InputField label="Name" name="name" value={profile.name} onChange={handleInputChange} />
            <InputField label="Age" name="age" type="number" value={profile.age} onChange={handleInputChange} />
             <div>
                <label htmlFor="smokingStatus" className="block text-sm font-medium text-gray-700">Smoking Status</label>
                <select id="smokingStatus" name="smokingStatus" value={profile.smokingStatus} onChange={handleInputChange} className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                    <option>non-smoker</option>
                    <option>smoker</option>
                    <option>former-smoker</option>
                </select>
            </div>
            <InputField label="Region" name="region" value={profile.region} onChange={handleInputChange} />
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>
           <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Measurement Units</label>
                    <p className="text-sm text-gray-500">Metric (ppm, °C)</p>
                </div>
            </div>
        </GlassCard>

        <GlassCard className="md:col-span-2">
            <div className="flex justify-end">
                <button className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
                    Save Changes
                </button>
            </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;
