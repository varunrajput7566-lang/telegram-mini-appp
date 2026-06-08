// Adsgram Configuration
const ADSGRAM_BLOCK_ID = import.meta.env.VITE_ADSGRAM_BLOCK_ID || '1234567890';
const ONCLICKA_BLOCK_ID = import.meta.env.VITE_ONCLICKA_BLOCK_ID || '0987654321';

declare global {
  interface Window {
    show: any;
    OnClickA: any;
  }
}

export interface AdWatchResult {
  success: boolean;
  platform: 'adsgram' | 'onclicka';
  watched_duration: number;
  message: string;
}

export class AdService {
  /**
   * Show Adsgram ad
   */
  static async showAdsgramAd(): Promise<AdWatchResult> {
    return new Promise((resolve) => {
      if (!window.show) {
        resolve({
          success: false,
          platform: 'adsgram',
          watched_duration: 0,
          message: 'Adsgram SDK not loaded'
        });
        return;
      }

      try {
        window.show({
          blockId: ADSGRAM_BLOCK_ID,
          onStart: () => {
            console.log('Adsgram ad started');
          },
          onClose: () => {
            console.log('Adsgram ad closed');
            resolve({
              success: true,
              platform: 'adsgram',
              watched_duration: 30,
              message: 'Ad watched successfully'
            });
          },
          onError: (error: any) => {
            console.error('Adsgram error:', error);
            resolve({
              success: false,
              platform: 'adsgram',
              watched_duration: 0,
              message: `Error: ${error.message}`
            });
          }
        });
      } catch (error: any) {
        resolve({
          success: false,
          platform: 'adsgram',
          watched_duration: 0,
          message: error.message
        });
      }
    });
  }

  /**
   * Show Onclicka ad
   */
  static async showOnclickaAd(): Promise<AdWatchResult> {
    return new Promise((resolve) => {
      if (!window.OnClickA) {
        resolve({
          success: false,
          platform: 'onclicka',
          watched_duration: 0,
          message: 'Onclicka SDK not loaded'
        });
        return;
      }

      try {
        window.OnClickA.show({
          blockId: ONCLICKA_BLOCK_ID,
          onStart: () => {
            console.log('Onclicka ad started');
          },
          onClose: () => {
            console.log('Onclicka ad closed');
            resolve({
              success: true,
              platform: 'onclicka',
              watched_duration: 30,
              message: 'Ad watched successfully'
            });
          },
          onError: (error: any) => {
            console.error('Onclicka error:', error);
            resolve({
              success: false,
              platform: 'onclicka',
              watched_duration: 0,
              message: `Error: ${error.message}`
            });
          }
        });
      } catch (error: any) {
        resolve({
          success: false,
          platform: 'onclicka',
          watched_duration: 0,
          message: error.message
        });
      }
    });
  }

  /**
   * Show random ad from both platforms in rotation
   */
  static async showRandomAd(): Promise<AdWatchResult> {
    const random = Math.random() > 0.5;
    
    if (random) {
      return this.showAdsgramAd();
    } else {
      return this.showOnclickaAd();
    }
  }
}
