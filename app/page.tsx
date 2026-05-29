'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { initSoundEngine, playSound, getRandomScript } from '@/lib/utils';
import { FloatingMessage } from '@/components/game/FloatingText';
import { WigAvatar } from '@/components/game/WigAvatar';
import { GameFooter } from '@/components/game/GameFooter';

interface FallingHair {
  id: string;
  x: number;
  y: number;
  angle: number;
  driftX: number;
  curveDir: number;
}

export default function GamePage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [messages, setMessages] = useState<FloatingMessage[]>([]);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [fallingHairs, setFallingHairs] = useState<FallingHair[]>([]);
  
  // 📍 스토어에서 resetGame을 정상적으로 가져옵니다.
  const { hairCount, depilate, increaseHair, isPremium, resetGame } = useGameStore();

  useEffect(() => {
    setIsMounted(true);
    initSoundEngine('/assets/sounds/pluck.mp3');

    const autoIncreaseTimer = setInterval(() => {
      if (increaseHair && hairCount > 0 && hairCount < 110) {
        increaseHair(); 
      }
    }, 1000);

    return () => clearInterval(autoIncreaseTimer);
  }, [hairCount, increaseHair]);

  const handleUltimateAction = (): void => {
    if (hairCount === 0) return; 

    try {
      playSound('/assets/sounds/pluck.mp3');
    } catch (e) {
      console.log("오디오 재생 대기");
    }

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 100);

    const currentNextCount = hairCount - 1; 
    depilate(); 

    const uniqueStringId = `${Date.now()}-${Math.random()}`;
    const isLeft = hairCount % 2 === 0;
    const spreadDistance = 40 + Math.random() * 60;
    const finalX = isLeft ? -(spreadDistance + 50) : spreadDistance - 10;    
    const finalY = 50 + Math.random() * 20;

    const newMsg: FloatingMessage = {
      id: uniqueStringId,
      text: getRandomScript(currentNextCount), 
      x: finalX, 
      y: finalY, 
      delay: Math.random() * 0.05
    };

    setMessages((prev) => [...prev, newMsg]);
       
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== uniqueStringId));
    }, 2200);

    const hairId = `hair-${Date.now()}-${Math.random()}`;
    const newHair: FallingHair = {
      id: hairId,
      x: 50 + Math.random() * 150,
      y: 25 + Math.random() * 30,
      angle: (Math.random() - 0.5) * 360, 
      driftX: (Math.random() - 0.5) * 110,
      curveDir: Math.random() > 0.5 ? 1 : -1
    };

    setFallingHairs((prev) => [...prev, newHair]);
    setTimeout(() => {
      setFallingHairs((prev) => prev.filter((h) => h.id !== hairId));
    }, 1600);
  };

  const hairPercentage = (hairCount / 110) * 100;

  if (!isMounted) {
    return <div className="text-stone-800 dark:text-white text-center pt-20 bg-stone-100 dark:bg-stone-950 min-h-screen font-mono">철제 프레임 동기화 중...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 dark:bg-black text-stone-900 dark:text-stone-200 p-4 pb-24 select-none overflow-hidden font-mono transition-colors duration-300">
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
          fallingHairs={fallingHairs}
          handleUltimateAction={handleUltimateAction}
          messages={messages}
          resetGame={resetGame}
        />
        
        {/* 🔄 hairCount === 0일 때 하단 레이아웃에 정석 다시하기 버튼 배치 */}
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

      {/* 하단 광고판 조립 */}
      <GameFooter isPremium={isPremium} />
    </div>
  );
}