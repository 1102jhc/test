import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 스토어 내부 데이터 및 함수들의 타입 정의
interface GameState {
  hairCount: number;      // 잔여 모발 개수
  isPremium: boolean;      // 광고 제거 아이템 구매 여부 (true면 하단 배너만 숨김)
  depilate: () => void;    // 클릭 시 머리카락 뽑는 함수
  increaseHair: () => void; // 타이머에 의해 머리카락이 다시 차오르는 함수
  buyPremium: () => void;  // 광고 제거 구매 함수
  resetGame: () => void;   // 게임 초기화 함수
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // 1. 초기 상태 설정 (기본 10만 가닥)
      hairCount: 110,
      isPremium: false,

      // 2. 머리카락 뽑기 로직
      // 광고 제거 상태(isPremium) 여부와 상관없이 무조건 차감됩니다.
      depilate: () =>
        set((state) => ({
          hairCount: state.hairCount > 0 ? state.hairCount - 1 : 0,
        })),

      // 3. 🔄 [핵심 수정]: 머리카락 자동 부활/상승 로직
      // 기존에 들어있던 'if (state.isPremium) return;' 방어벽을 완전히 삭제했습니다.
      // 이제 광고를 없애도 최대치(10만 가닥)까지 실시간으로 정상 복구됩니다.
      increaseHair: () =>
        set((state) => ({
          hairCount: state.hairCount < 110 ? state.hairCount + 1 : 110,
        })),

      // 4. 광고 제거 아이템 활성화
      buyPremium: () =>
        set(() => ({
          isPremium: true,
        })),

      // 5. 게임 공장 초기화
      resetGame: () =>
  set(() => ({
    hairCount: 110, // 🔄 page.tsx 및 WigAvatar.tsx 스펙과 동일하게 110 가닥으로 교정
    isPremium: false,
  })),
    }),
    {
      // 📍 로컬 스토리지에 저장될 고유 키 이름 (중복 방지 및 식별용)
      name: 'pluck-hair-game-storage',
    }
  )
);