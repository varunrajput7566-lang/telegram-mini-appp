import React, { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import AdsScreen from './screens/AdsScreen';
import TasksScreen from './screens/TasksScreen';
import WithdrawalScreen from './screens/WithdrawalScreen';
import LeaderboardModal from './modals/LeaderboardModal';
import '../styles/Layout.css';

type Screen = 'ads' | 'tasks' | 'withdrawal' | 'leaderboard';

export default function AppLayout() {
  const [activeScreen, setActiveScreen] = useState<Screen>('ads');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="app-layout">
      <Header 
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenWithdrawal={() => setActiveScreen('withdrawal')}
      />

      <div className="screen-content">
        {activeScreen === 'ads' && <AdsScreen />}
        {activeScreen === 'tasks' && <TasksScreen />}
        {activeScreen === 'withdrawal' && <WithdrawalScreen />}
      </div>

      <BottomNav 
        activeScreen={activeScreen} 
        onNavigate={setActiveScreen}
      />

      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}
