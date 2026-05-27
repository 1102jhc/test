import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 데이터 보존 미들웨어 추가

interface GameState {
  hairCount: number;
  isAdsPlaying: boolean;
  isPremium: boolean;
  depilate: () => void;
  setAdsPlaying: (playing: boolean) => void;
  buyPremium: () => void;
}

/**
 * [게임 전역 스토어 (Persist 적용)]
 * 로컬 스토리지에 'allieoyo-hair-game'이라는 키로 모발 수가 자동 저장됩니다.
 */
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      hairCount: 100000,
      isAdsPlaying: false,
      isPremium: false,

      depilate: () => set((state) => ({ 
        hairCount: state.hairCount > 0 ? state.hairCount - 1 : 0 
      })),

      setAdsPlaying: (playing) => set({ isAdsPlaying: playing }),

      buyPremium: () => set({ isPremium: true, isAdsPlaying: false }),
    }),
    {
      // 로컬 스토리지에 저장될 고유 키값
      name: 'allieoyo-hair-game', 
      // UI 웅성거림 방지: 광고 재생 상태 같은 일시적인 값은 저장에서 제외하고 hairCount와 premium만 킵
      partialize: (state) => ({ hairCount: state.hairCount, isPremium: state.isPremium }),
    }
  )
);