
import React from 'react';
import { Page } from '../types';
import { LungsIcon, DashboardIcon, HistoryIcon, ProfileIcon, SupportIcon } from './icons/Icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { name: Page.Home, icon: <LungsIcon className="w-6 h-6" /> },
    { name: Page.Dashboard, icon: <DashboardIcon className="w-6 h-6" /> },
    { name: Page.History, icon: <HistoryIcon className="w-6 h-6" /> },
    { name: Page.Profile, icon: <ProfileIcon className="w-6 h-6" /> },
    { name: Page.Support, icon: <SupportIcon className="w-6 h-6" /> },
  ];

  // FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
  const NavLink: React.FC<{ item: { name: Page; icon: React.ReactElement } }> = ({ item }) => (
    <button
      onClick={() => setActivePage(item.name)}
      className={`flex items-center justify-center md:justify-start w-full p-3 my-2 rounded-lg transition-all duration-300 ${
        activePage === item.name
          ? 'bg-cyan-500/20 text-cyan-600'
          : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-900'
      }`}
    >
      {item.icon}
      <span className="hidden md:inline ml-4 font-semibold">{item.name}</span>
    </button>
  );

  return (
    <aside className="fixed top-0 left-0 h-full w-20 md:w-64 bg-white/40 backdrop-blur-lg border-r border-gray-200 p-4 flex flex-col justify-between z-50">
      <div>
        <div className="flex items-center justify-center md:justify-start mb-10 p-2">
          <LungsIcon className="w-8 h-8 text-cyan-500" />
          <h1 className="hidden md:block ml-3 text-xl font-bold font-poppins text-gray-900">
            Pulmo<span className="text-cyan-500">Sense</span>
          </h1>
        </div>
        <nav>
          {navItems.map((item) => <NavLink key={item.name} item={item} />)}
        </nav>
      </div>
      <div className="flex flex-col space-y-4">
        <footer className="text-center text-xs text-gray-500 hidden md:block">
          © PulmoSense 2025
        </footer>
      </div>
    </aside>
  );
};

export default Sidebar;
