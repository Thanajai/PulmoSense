import React from 'react';
import GlassCard from '../components/GlassCard';
import { User } from '../types';
import { authService } from '../services/authService';

interface ProfilePageProps {
  user: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold font-poppins text-gray-900 mb-6">Profile & Settings</h1>
      <GlassCard>
        <div className="p-4">
          {user ? (
            <div className="flex flex-col items-center text-center">
              <img
                src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
              <p className="text-gray-600">{user.email}</p>
              <button
                onClick={authService.signOutUser}
                className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Join PulmoSense</h2>
              <p className="text-gray-600 mb-6">Sign in to save your sessions and track your history across devices.</p>
              <button
                onClick={authService.signInWithGoogle}
                className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center mx-auto"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.487-11.187-8.164l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.626,44,31.1,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfilePage;