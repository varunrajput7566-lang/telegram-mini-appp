import React, { useContext } from 'react';
import { AppContext } from '../App';
import '../styles/Header.css';

interface HeaderProps {
  onOpenLeaderboard: () => void;
  onOpenWithdrawal: () => void;
}

export default function Header({ onOpenLeaderboard, onOpenWithdrawal }: HeaderProps) {
  const context = useContext(AppContext);
  const user = context?.user;

  return (
    <div className="header">
      <button className="btn-withdrawal" onClick={onOpenWithdrawal}>
        💰 Withdraw
      </button>

      <div className="balance-display">
        <span className="balance-label">Balance</span>
        <span className="balance-amount">₹{user?.balance.toFixed(2) || '0.00'}</span>
      </div>

      <button className="btn-leaderboard" onClick={onOpenLeaderboard}>
        🏆 Leaderboard
      </button>
    </div>
  );
}
