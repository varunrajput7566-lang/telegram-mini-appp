import { User, Ad, Task, WithdrawalRequest, LeaderboardUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:8000/webhooks';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

async function getTelegramInitData() {
  if (window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initData;
  }
  return null;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Telegram init data for verification
  const initData = await getTelegramInitData();
  if (initData) {
    headers['X-Telegram-Init-Data'] = initData;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Server error');
      }
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
}

export const apiClient = {
  // Users
  createUser: (data: { telegram_id: number; name: string; username: string }) =>
    request<User>('/users/create', { method: 'POST', body: data }),

  getUser: (telegramId: number) =>
    request<User>(`/users/${telegramId}`),

  getUserBalance: (telegramId: number) =>
    request<{ balance: number; ads_watched_today: number; tasks_completed_today: number }>(
      `/users/${telegramId}/balance`
    ),

  // Ads
  getAdsgramAds: (telegramId: number) =>
    request<{ ads: Ad[] }>(`/adsgram/ads?telegram_id=${telegramId}`),

  getOnclickaAds: (telegramId: number) =>
    request<{ ads: Ad[] }>(`/onclicka/ads?telegram_id=${telegramId}`),

  // Tasks
  getAdsgramTasks: (telegramId: number) =>
    request<{ tasks: Task[] }>(`/adsgram/tasks?telegram_id=${telegramId}`),

  // Withdrawal
  createWithdrawalRequest: (data: {
    telegram_id: number;
    amount: number;
    upi_id: string;
    phone: string;
  }) =>
    request<WithdrawalRequest>('/withdrawal/request', {
      method: 'POST',
      body: data,
    }),

  getWithdrawalHistory: (telegramId: number) =>
    request<{ withdrawals: WithdrawalRequest[]; count: number }>(
      `/withdrawal/history/${telegramId}`
    ),

  // Leaderboard
  getLeaderboard: (limit: number = 100) =>
    request<{ leaderboard: LeaderboardUser[] }>(
      `/leaderboard?limit=${limit}`
    ),
};
