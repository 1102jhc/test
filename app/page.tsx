'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { useGameStore } from '@/lib/store';
import { WigAvatar } from '@/components/game/WigAvatar';
import { GameFooter } from '@/components/game/GameFooter';
import { useHairManager } from '@/hooks/useHairManager'; // 👈 분리한 커스텀 훅 임포트

interface HairCustomProperties extends CSSProperties {
  '--init-deg'?: string;
  '--spin-deg'?: string;
  '--drift-x'?: string;
}

export default function GamePage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  const { hairCount, increaseHair, isPremium, resetGame } = useGameStore();
  
  // 🔄 리팩토링 핵심: 무거운 상태와 머리카락 생성 기능을 훅으로 완전 분리 추출
  const { messages, isShaking, fallingHairs, handleUltimateAction } = useHairManager();

  useEffect(() => {
    setIsMounted(true);

    const state = useGameStore.getState();
    
    if (state.hairCount === 0) {
      resetGame(); 
    } 
    else if (state.hairCount > 0 && state.hairCount < 100000 && state.lastSavedTime) {
      const now = Date.now();
      const gapInSeconds = Math.floor((now - state.lastSavedTime) / 1000);

      if (gapInSeconds > 0) {
        const nextCount = Math.min(100000, state.hairCount + gapInSeconds);
        useGameStore.setState({ 
          hairCount: nextCount,
          lastSavedTime: now 
        });
      }
    }

    const autoIncreaseTimer = setInterval(() => {
      const currentHair = useGameStore.getState().hairCount;
      if (increaseHair && currentHair > 0 && currentHair < 100000) {
        increaseHair(); 
      }
    }, 1000);

    return () => clearInterval(autoIncreaseTimer);
  }, [increaseHair, resetGame]);

  const hairPercentage = (hairCount / 100000) * 100;

  if (!isMounted) {
    return <div className="text-stone-800 dark:text-white text-center pt-20 bg-stone-100 dark:bg-stone-950 min-h-screen font-mono">철제 프레임 동기화 중...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 dark:bg-black text-stone-900 dark:text-stone-200 p-4 pb-24 select-none overflow-x-hidden font-mono transition-colors duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes hammer-impact {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          15% { transform: translate(7px, 9px) scale(0.95) rotate(1.5deg); }
          40% { transform: translate(-4px, -3px) scale(0.98) rotate(-0.5deg); }
          70% { transform: translate(1px, 1px) scale(0.99); }
          100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        }
        .impact-active {
          animation: hammer-impact 0.1s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        /* 살랑살랑 끊김 없이 바닥까지 떨어지는 리얼 낙하 공식 */
        @keyframes fixed-parabolic-fall {
          0% { opacity: 1; transform: translateY(0) scaleY(1) rotate(0deg); }
          8% { transform: translateY(-15px) scaleY(1.03) rotate(calc(var(--init-deg) * 0.15)); opacity: 1; }
          100% { transform: translateY(85vh) translateX(var(--drift-x)) rotate(calc(var(--init-deg) + var(--spin-deg))) scaleY(0.9); opacity: 0; }
        }
        .animate-fixed-hair-fall { 
          animation: fixed-parabolic-fall 3.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; 
        }
      `}} />

      <div className={`flex flex-col items-center justify-center w-full max-w-md transition-all duration-75 ${isShaking ? 'impact-active' : ''}`}>
        <h1 className="text-2xl font-black mb-1 text-stone-700 dark:text-stone-400 tracking-widest uppercase border-b border-stone-300 dark:border-stone-800 pb-1 w-full text-center">
          탈모의 미학
        </h1>
        <p className="text-[9px] text-orange-600 dark:text-orange-800 font-mono mb-6 tracking-widest uppercase font-bold">
          LIVE
        </p>

        {/* 전광판 */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-md mb-8 text-center border-2 border-stone-300 dark:border-stone-800 min-w-[290px] shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest mb-1">나머지 모근 수량</p>
          <p className="text-4xl font-black text-orange-600 font-mono">
            {hairCount.toLocaleString()} <span className="text-xs font-normal text-stone-400">가닥</span>
          </p>
        </div>

        {/* 캐릭터 구역 조립 */}
        <WigAvatar 
          hairCount={hairCount}
          hairPercentage={hairPercentage}
          handleUltimateAction={handleUltimateAction}
          messages={messages}
          resetGame={resetGame}
        />
        
        {/* 다시하기 버튼 배치 */}
        {hairCount === 0 && (
          <div className="w-full flex flex-col items-center gap-3 mt-4">
            <div className="text-center px-4 py-2 bg-white dark:bg-stone-900 border-2 border-orange-500 rounded-md shadow-md animate-pulse w-full">
              <p className="text-xs font-black text-orange-600 dark:text-orange-500 font-mono">
                "다 뽑으니까 속이 후련하냐? 내 머리도, 네 미래도 아주 투명하네ㅋ"
              </p>
            </div>
            
            <button
              onClick={resetGame}
              className="w-full py-3 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-black text-xs rounded border-2 border-stone-700 dark:border-stone-300 shadow-md active:scale-[0.98] transition-all tracking-widest uppercase cursor-pointer text-center"
            >
              🔄 다시 하기
            </button>
          </div>
        )}
      </div>

      {/* 최상위 fixed 머리카락 렌더링 구역 */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {fallingHairs.map((hair) => {
          const spinDegrees = hair.curveDir * (180 + Math.random() * 180);
          const hairInlineStyle: HairCustomProperties = {
            left: `${hair.x}vw`, 
            top: `${hair.y}vh`,  
            width: '14px',
            height: '22px',
            '--init-deg': `${hair.angle}deg`,
            '--spin-deg': `${spinDegrees}deg`, 
            '--drift-x': `${hair.driftX}px`
          };

          return (
            <div key={hair.id} className="absolute animate-fixed-hair-fall pointer-events-none" style={hairInlineStyle}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d={hair.curveDir > 0 ? "M 30 0 Q 80 30, 20 60 T 50 100" : "M 70 0 Q 20 30, 80 60 T 50 100"} fill="none" stroke="currentColor" className="stroke-stone-900 dark:stroke-stone-200" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
          );
        })}
      </div>

      <GameFooter isPremium={isPremium} />
    </div>
  );
}