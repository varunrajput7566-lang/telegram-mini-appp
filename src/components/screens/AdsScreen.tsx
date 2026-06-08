import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../App';
import { apiClient } from '../../api/client';
import { AdService } from '../../services/adService';
import '../../styles/AdsScreen.css';

export default function AdsScreen() {
  const context = useContext(AppContext);
  const user = context?.user;
  const [adStats, setAdStats] = useState({
    ads_watched_total: 0,
    adsgram_ads: 0,
    onclicka_ads: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showingAd, setShowingAd] = useState(false);

  useEffect(() => {
    loadAdStats();
  }, [user?.telegram_id]);

  const loadAdStats = async () => {
    try {
      if (!user) return;
      const stats = await apiClient.getAdStats(user.telegram_id);
      setAdStats(stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ad stats');
    }
  };

  const handleWatchAd = async () => {
    try {
      setLoading(true);
      setShowingAd(true);
      setError(null);

      if (!user) return;

      // Show random ad from both platforms
      const result = await AdService.showRandomAd();

      if (!result.success) {
        setError(result.message);
        setShowingAd(false);
        setLoading(false);
        return;
      }

      // Record ad watched on backend
      const response = await apiClient.recordAdWatched({
        telegram_id: user.telegram_id,
        platform: result.platform,
        watched_duration: result.watched_duration,
      });

      if (response.success) {
        // Reload stats
        await loadAdStats();
        setError(null);
      } else {
        setError(response.message);
      }

      setShowingAd(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to watch ad');
      setShowingAd(false);
    } finally {
      setLoading(false);
    }
  };

  const isLimitReached = adStats.ads_watched_total >= 30;
  const adsgramLimitReached = adStats.adsgram_ads >= 15;
  const onclickaLimitReached = adStats.onclicka_ads >= 15;

  return (
    <div className="ads-screen">
      <div className="ads-container">
        <h2>📺 Watch Ads</h2>

        <div className="ads-stats">
          <div className="stat">
            <span className="stat-label">Total Ads</span>
            <span className="stat-value">
              {adStats.ads_watched_total}/30
            </span>
          </div>

          <div className="stat">
            <span className="stat-label">Adsgram</span>
            <span className="stat-value">
              {adStats.adsgram_ads}/15
            </span>
          </div>

          <div className="stat">
            <span className="stat-label">Onclicka</span>
            <span className="stat-value">
              {adStats.onclicka_ads}/15
            </span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="btn-watch-ad"
          onClick={handleWatchAd}
          disabled={loading || showingAd || isLimitReached}
        >
          {loading || showingAd ? 'Showing Ad...' : 'Watch Ad'}
        </button>

        {isLimitReached && (
          <div className="success-message">
            ✅ You've watched all 30 ads today! <br/>
            Complete 10 tasks to get your ₹{user?.balance || '0'} reward.
          </div>
        )}

        <div className="ads-info">
          <h3>📋 How it works:</h3>
          <ul>
            <li>✅ Watch ads for 30 seconds each</li>
            <li>✅ Maximum 15 ads from each platform</li>
            <li>✅ Complete 30 ads + 10 tasks = ₹10 reward</li>
            <li>⏰ Limits reset daily at 12:01 AM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
