import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';
import { apiClient } from '../../api/client';
import '../../styles/WithdrawalScreen.css';

export default function WithdrawalScreen() {
  const context = useContext(AppContext);
  const user = context?.user;
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [upiId, setUpiId] = useState(user?.upi_id || '');
  const [amount, setAmount] = useState('300');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const withdrawAmount = parseFloat(amount);

      if (withdrawAmount < 300) {
        setError('Minimum withdrawal is 300 rupees');
        return;
      }

      if (user.balance < withdrawAmount) {
        setError('Insufficient balance');
        return;
      }

      await apiClient.createWithdrawalRequest({
        telegram_id: user.telegram_id,
        amount: withdrawAmount,
        upi_id: upiId,
        phone,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setAmount('300');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdrawal-screen">
      <div className="withdrawal-form">
        <h2>Withdrawal Request</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
              pattern="[0-9]{10}"
            />
          </div>

          <div className="form-group">
            <label>UPI ID *</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter UPI ID (e.g., name@upi)"
              required
              pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+"
            />
          </div>

          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum 300"
              required
              min="300"
            />
            <span className="available-balance">Available: ₹{user?.balance.toFixed(2)}</span>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">Withdrawal request submitted! It will be processed shortly.</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Processing...' : 'Request Withdrawal'}
          </button>
        </form>
      </div>
    </div>
  );
}
