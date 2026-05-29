import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. 스토어 내부 데이터 및 함수들의 타입 정의
interface GameState {
  hairCount: number;      // 잔여 모발 개수
  isPremium: boolean;      // 광고 제거 아이템 구매 여부
  lastSavedTime: number;   // 🔄 오프라인 차오르기용 마지막 저장 시간
  depilate: () => void;    // 클릭 시 머리카락 뽑는 함수
  increaseHair: () => void; // 타이머에 의해 머리카락이 다시 차오르는 함수
  buyPremium: () => void;  // 광고 제거 구매 함수
  resetGame: () => void;   // 게임 초기화 함수
}

// 2. Zustand 스토어 생성 (꼬여있던 괄호 및 타입 선언 교정)
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      hairCount: 100000,
      isPremium: false,
      lastSavedTime: Date.now(), // 초기값 설정

      // 머리카락 뽑기 로직 (시간 갱신 포함)
      depilate: () =>
        set((state) => ({
          hairCount: state.hairCount > 0 ? state.hairCount - 1 : 0,
          lastSavedTime: Date.now(),
        })),

      // 머리카락 자동 부활 로직 (시간 갱신 포함)
      increaseHair: () =>
        set((state) => ({
          hairCount: state.hairCount < 100000 ? state.hairCount + 1 : 100000,
          lastSavedTime: Date.now(),
        })),

      // 광고 제거 아이템 활성화
      buyPremium: () =>
        set(() => ({
          isPremium: true,
        })),

      // 게임 공장 초기화 (100000 가닥 싱크 맞춤)
      resetGame: () =>
        set(() => ({
          hairCount: 100000, 
          isPremium: false,
          lastSavedTime: Date.now(),
        })),
    }),
    {
      name: 'pluck-hair-game-storage',
      version: 1,
    }
  )
);