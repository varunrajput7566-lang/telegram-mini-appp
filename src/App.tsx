import React, { useEffect, useState } from 'react';
import { AppContext as AppContextType, User } from './types';
import AppLayout from './components/Layout';
import RulesModal from './components/modals/RulesModal';
import SetupModal from './components/modals/SetupModal';
import ServerDownModal from './components/modals/ServerDownModal';
import { apiClient } from './api/client';
import './App.css';

const AppContext = React.createContext<AppContextType | null>(null);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverDown, setServerDown] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showServerDownModal, setShowServerDownModal] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if Telegram WebApp is available
      if (!window.Telegram?.WebApp) {
        setError('This app must be opened in Telegram');
        setLoading(false);
        return;
      }

      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;

      if (!telegramUser) {
        setError('Unable to get user information');
        setLoading(false);
        return;
      }

      // Try to get user from database
      const existingUser = await apiClient.getUser(telegramUser.id);
      setUser(existingUser);
      setShowRulesModal(false);
      setLoading(false);
    } catch (err) {
      // User doesn't exist, show setup
      console.error(err);
      setShowRulesModal(true);
      setLoading(false);
    }
  };

  const handleRulesAccept = () => {
    setShowRulesModal(false);
    setShowSetupModal(true);
  };

  const handleSetupComplete = (userData: User) => {
    setUser(userData);
    setShowSetupModal(false);
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <AppContext.Provider value={{ user, loading, error, serverDown }}>
      <div className="app">
        {showRulesModal && <RulesModal onAccept={handleRulesAccept} />}
        {showSetupModal && <SetupModal onComplete={handleSetupComplete} />}
        {showServerDownModal && <ServerDownModal />}
        
        {user && <AppLayout />}
      </div>
    </AppContext.Provider>
  );
}

export { App, AppContext };
