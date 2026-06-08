import React, { useState } from 'react';
import { User } from '../../types';
import { apiClient } from '../../api/client';
import '../../styles/modals.css';

interface SetupModalProps {
  onComplete: (user: User) => void;
}

export default function SetupModal({ onComplete }: SetupModalProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !username.trim()) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const telegramUser = window.Telegram?.WebApp.initDataUnsafe.user;

      if (!telegramUser) {
        setError('Unable to get user information');
        return;
      }

      const user = await apiClient.createUser({
        telegram_id: telegramUser.id,
        name: name.trim(),
        username: username.trim(),
      });

      if (user) {
        onComplete(user);
      } else {
        setError('Failed to create user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Complete Your Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Setting up...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
