import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../App';
import { apiClient } from '../../api/client';
import { Ad } from '../../types';
import '../../styles/AdsScreen.css';

export default function AdsScreen() {
  const context = useContext(AppContext);
  const user = context?.user;
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAds();
  }, [user?.telegram_id]);

  const loadAds = async () => {
    try {
      setLoading(true);
      if (!user) return;

      // Alternate between platforms
      const adsFromAdsgram = await apiClient.getAdsgramAds(user.telegram_id);
      const adsFromOnclicka = await apiClient.getOnclickaAds(user.telegram_id);

      const allAds = [
        ...adsFromAdsgram.ads.map(ad => ({ ...ad, platform: 'adsgram' as const })),
        ...adsFromOnclicka.ads.map(ad => ({ ...ad, platform: 'onclicka' as const })),
      ];

      setAds(allAds);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ads.length === 0 || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Ad completed successfully
          handleAdComplete();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ads, timeRemaining]);

  const handleAdComplete = () => {
    if (currentAdIndex < ads.length - 1) {
      setCurrentAdIndex(currentAdIndex + 1);
    } else {
      // All ads watched
      loadAds();
      setCurrentAdIndex(0);
    }
  };

  const handleSkip = () => {
    setTimeRemaining(30);
    if (currentAdIndex < ads.length - 1) {
      setCurrentAdIndex(currentAdIndex + 1);
    }
  };

  if (loading) return <div className="ads-screen"><div className="loader">Loading ads...</div></div>;
  if (error) return <div className="ads-screen"><div className="error">{error}</div></div>;

  const currentAd = ads[currentAdIndex];

  return (
    <div className="ads-screen">
      <div className="ad-container">
        <div className="ad-video">
          <video src={currentAd?.video_url} autoPlay={true} />
        </div>

        <div className="ad-timer">
          <div className="timer-display">
            <span className="time">{timeRemaining}s</span>
          </div>
          <div className="timer-bar">
            <div className="timer-fill" style={{ width: `${(timeRemaining / 30) * 100}%` }}></div>
          </div>
        </div>

        <div className="ad-info">
          <h3>{currentAd?.title}</h3>
          <p>{currentAd?.description}</p>
        </div>

        <button className="btn-skip" onClick={handleSkip} disabled={timeRemaining < 5}>
          Skip Ad
        </button>

        <div className="ads-progress">
          Ads: {user?.ads_watched_today || 0}/30
        </div>
      </div>
    </div>
  );
}
