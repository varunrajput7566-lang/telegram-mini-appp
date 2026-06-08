import React, { useContext } from 'react';
import { AppContext } from '../App';
import '../styles/BottomNav.css';

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export default function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  const context = useContext(AppContext);
  const user = context?.user;

  return (
    <div className="bottom-nav">
      <button
        className={`nav-item ${activeScreen === 'ads' ? 'active' : ''}`}
        onClick={() => onNavigate('ads')}
      >
        <span className="icon">📺</span>
        <span className="label">Watch Ads</span>
        <span className="count">{user?.ads_watched_today || 0}/30</span>
      </button>

      <button
        className={`nav-item ${activeScreen === 'tasks' ? 'active' : ''}`}
        onClick={() => onNavigate('tasks')}
      >
        <span className="icon">✅</span>
        <span className="label">Tasks</span>
        <span className="count">{user?.tasks_completed_today || 0}/10</span>
      </button>
    </div>
  );
}
