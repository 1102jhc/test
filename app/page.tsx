'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script'; // 외부 광고 자바스크립트를 안전하게 로드하기 위한 Next.js 내장 컴포넌트
import { useGameStore } from '@/lib/store';
import { initSoundEngine, playSound } from '@/lib/utils';
import { FloatingText, FloatingMessage } from '@/components/game/FloatingText';
import { TALK_SCRIPTS } from '@/lib/constants';

interface TalkScriptRange {
  min: number;
  max: number;
  lines: string[];
}

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
  
  const { hairCount, depilate, isPremium } = useGameStore();

  useEffect(() => {
    setIsMounted(true);
    initSoundEngine('/assets/sounds/pluck.mp3');
  }, []);

  const getRandomScript = (currentCount: number): string => {
    const count = Math.max(1, Math.min(100000, currentCount));
    const matchedRange = (TALK_SCRIPTS as TalkScriptRange[]).find(
      (range) => count >= range.min && count <= range.max
    );
    if (!matchedRange) return "어허, 손 치워라.";
    const randomIndex = Math.floor(Math.random() * matchedRange.lines.length);
    return matchedRange.lines[randomIndex];
  };

  const handleUltimateAction = (): void => {
    depilate();
    playSound('/assets/sounds/pluck.mp3');

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 100);

    const uniqueStringId = `${Date.now()}-${Math.random()}`;
    const nextCount = hairCount > 0 ? hairCount - 1 : 0;

    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 30;   

    const newMsg: FloatingMessage = {
      id: uniqueStringId,
      text: getRandomScript(nextCount),
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius - 40, 
      delay: Math.random() * 0.5
    };

    setMessages((prev) => [...prev, newMsg]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== uniqueStringId));
    }, 2200);

    if (hairCount > 0) {
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
    }
  };

  const hairPercentage = (hairCount / 100000) * 100;

  if (!isMounted) {
    return <div className="text-stone-800 dark:text-white text-center pt-20 bg-stone-100 dark:bg-stone-950 min-h-screen font-mono">철제 프레임 동기화 중...</div>;
  }

  return (
    // 하단 광고 배너 영역이 본문을 가리지 않도록 전체 화면 밑단 패딩(pb-24) 확보
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
        
        @keyframes hair-smooth-continuous-fall {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(var(--init-deg));
          }
          15% {
            transform: translateY(-35px) translateX(calc(var(--drift-x) * 0.15)) rotate(calc(var(--init-deg) + 45deg));
          }
          100% {
            opacity: 0;
            transform: translateY(260px) translateX(var(--drift-x)) rotate(var(--final-deg));
          }
        }
        .parabolic-hair-style {
          animation: hair-smooth-continuous-fall 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}} />

      <div 
        className={`flex flex-col items-center justify-center w-full max-w-md transition-all duration-75 ${
          isShaking ? 'impact-active' : ''
        }`}
        style={{
          filter: isShaking ? 'contrast(1.7) brightness(1.3) saturate(1.2)' : 'contrast(1.1) brightness(0.95)'
        }}
      >
        <h1 className="text-2xl font-black mb-1 text-stone-700 dark:text-stone-400 tracking-widest uppercase border-b border-stone-300 dark:border-stone-800 pb-1 w-full text-center">
          탈모의 미학
        </h1>
        <p className="text-[9px] text-orange-600 dark:text-orange-800 font-mono mb-6 tracking-widest uppercase font-bold">
          YLLIX LIVE DEPLOYMENT v10.0
        </p>

        {/* 잔여 모발 전광판 */}
        <div className={`bg-white dark:bg-stone-900 p-4 rounded-md mb-8 text-center border-2 border-stone-300 dark:border-stone-800 min-w-[290px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-all ${
          isShaking ? 'border-orange-500 dark:border-orange-900 bg-orange-50/10' : ''
        }`}>
          <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest mb-1">나머지 모근 수량</p>
          <p className="text-4xl font-black text-orange-600 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {hairCount.toLocaleString()} <span className="text-xs font-normal text-stone-400 dark:text-stone-500">가닥</span>
          </p>
        </div>

        {/* 캐릭터 영역 카드 */}
        <div className="relative mb-8 flex items-center justify-center w-64 h-64">
          <div
            onPointerDown={handleUltimateAction}
            className="relative w-full h-full rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_4px_20px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden border-4 border-stone-300 dark:border-stone-800 cursor-pointer bg-stone-50 dark:bg-stone-900 transition-transform"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              transform: isShaking ? 'translateY(4px) scale(0.97)' : 'translateY(0) scale(1)'
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transition-all duration-300" style={{ filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.15))' }}>
              <rect width="100" height="100" className="fill-stone-200 dark:fill-[#1c1917]" />
              <path d="M0 25 H100 M0 50 H100 M0 75 H100 M25 0 V100 M50 0 V100 M75 0 V100" className="stroke-stone-300 dark:stroke-[#141210]" strokeWidth="0.5" />
              <path d="M25 100 L50 72 L75 100 Z" className="fill-stone-300 dark:fill-[#24201e] stroke-stone-400 dark:stroke-[#3a3633]" strokeWidth="1.5" />
              <path d="M30 38 L70 38 L66 78 L50 86 L34 78 Z" className="fill-stone-400 dark:fill-[#6e6761] stroke-stone-500 dark:stroke-[#3a3530]" strokeWidth="2" />
              <path d="M34 62 L50 87 L66 62 L58 76 L50 81 L42 76 Z" fill="#000000" stroke="#000000" strokeWidth="1.5" />
              <path d="M38 62 L50 80 L62 62 Z" fill="#000000" opacity="0.4" />
              <path d="M38 52 L46 51 M54 51 L62 52" stroke="#000" strokeWidth="3" strokeLinecap="round" />
              <path d="M47 48 L53 48 L50 63 Z" className="fill-stone-500 dark:fill-[#3a3530] stroke-stone-600 dark:stroke-[#24201e]" strokeWidth="0.5" />
              {hairCount === 0 ? (
                <path d="M43 69 Q50 76 57 69" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M43 71 L57 71" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              )}
              <g fill="#000000" stroke="#000000" strokeWidth="0.5">
                {hairPercentage >= 75 && (
                  <path d="M26 35 L34 20 L50 15 L66 20 L74 35 L64 38 L50 36 L36 38 Z" />
                )}
                {hairPercentage >= 40 && (
                  <>
                    <path d="M26 32 Q32 35 34 46 L26 44 Z" />
                    <path d="M74 32 Q68 35 66 46 L74 44 Z" />
                  </>
                )}
                {hairCount > 0 && (
                  <>
                    <circle cx="25" cy="46" r="3" />
                    <circle cx="75" cy="46" r="3" />
                    <circle cx="26" cy="51" r="2" />
                    <circle cx="74" cy="51" r="2" />
                  </>
                )}
              </g>
              {hairCount === 0 && (
                <circle cx="50" cy="28" r="15" fill="url(#baldGlow)" opacity="0.35" />
              )}
              <defs>
                <radialGradient id="baldGlow">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* 검은 머리카락 낙하 이펙트 */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              {fallingHairs.map((hair) => (
                <div
                  key={hair.id}
                  className="absolute bg-black parabolic-hair-style"
                  style={{
                    left: `${hair.x}px`,
                    top: `${hair.y}px`,
                    width: '1px',
                    height: '18px',
                    borderRadius: hair.curveDir > 0 ? '100% 0% 0% 100%' : '0% 100% 100% 0%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    '--init-deg': `${hair.angle}deg`,
                    '--final-deg': `${hair.angle + 280}deg`, 
                    '--drift-x': `${hair.driftX}px`
                  } as any}
                />
              ))}
            </div>

            {isShaking && (
              <div className="absolute inset-0 bg-orange-500/10 pointer-events-none mix-blend-overlay" />
            )}
          </div>

          <FloatingText messages={messages} />
        </div>
      </div>

      {/* 📺 하단 고정형 일릭스(Advertica) 실제 라이브 광고 슬롯 */}
      {!isPremium && (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-stone-200 dark:bg-stone-900 border-t border-stone-300 dark:border-stone-800 flex items-center justify-center py-2 px-4 z-40 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] transition-colors duration-300">
          
          {/* 일릭스 468x60 물리 규격 안착 슬롯 */}
          <div className="w-full max-w-[468px] min-h-[60px] bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 flex items-center justify-center relative rounded overflow-hidden">
            
            {/* 제공해주신 일릭스 순정 <ins> 태그 완벽 맵핑 */}
            <ins 
              style={{ width: '468px', height: '60px', display: 'block' }} 
              data-width="468" 
              data-height="60" 
              className="v31d7ba9970" 
              data-domain="//data527.click" 
              data-affquery="/eb7604155d5ba888dd42/31d7ba9970/?placementName=hairgame_bottom_banner"
            >
              {/* 일릭스 자바스크립트 모듈을 Next.js Script 컴포넌트로 비동기 가동 */}
              <Script 
                src="//data527.click/js/responsive.js" 
                strategy="afterInteractive" 
              />
            </ins>

          </div>
        </div>
      )}
    </div>
  );
}