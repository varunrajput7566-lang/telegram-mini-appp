import React, { useEffect, useState } from 'react';
import { LeaderboardUser } from '../../types';
import { apiClient } from '../../api/client';
import '../../styles/modals.css';

interface LeaderboardModalProps {
  onClose: () => void;
}

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await apiClient.getLeaderboard(100);
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏆 Leaderboard</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((user, index) => (
              <div key={user.telegram_id} className="leaderboard-item">
                <div className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>
                <div className="user-info">
                  <p className="username">@{user.username}</p>
                </div>
                <div className="balance">₹{user.balance.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        <p className="update-time">Updates daily at 12:01 AM</p>
      </div>
    </div>
  );
}
