export interface User {
  id: number;
  telegram_id: number;
  name: string;
  username: string;
  balance: number;
  ads_watched_today: number;
  tasks_completed_today: number;
  ads_watched_total: number;
  tasks_completed_total: number;
  total_withdrawn: number;
  upi_id?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  reward: number;
  platform: 'adsgram' | 'onclicka';
  watched: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  action_url: string;
  reward: number;
  platform: 'adsgram';
  completed: boolean;
}

export interface WithdrawalRequest {
  id: number;
  telegram_id: number;
  amount: number;
  upi_id: string;
  phone: string;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  completed_at?: string;
}

export interface LeaderboardUser {
  telegram_id: number;
  username: string;
  balance: number;
  rank?: number;
}

export interface AppContext {
  user: User | null;
  loading: boolean;
  error: string | null;
  serverDown: boolean;
}
