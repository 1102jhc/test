'use client';

import { useState, useEffect } from 'react';
import { FloatingText, FloatingMessage } from '@/components/game/FloatingText';

interface WigAvatarProps {
  hairCount: number;
  hairPercentage: number;
  handleUltimateAction: () => void;
  messages: FloatingMessage[];
  resetGame: () => void;
}

export function WigAvatar({
  hairCount,
  hairPercentage,
  handleUltimateAction,
  messages,
  resetGame,
}: WigAvatarProps) {
  const [isResetPanelOpen, setIsResetPanelOpen] = useState<boolean>(true);

  useEffect(() => {
    if (hairCount > 100) {
      setIsResetPanelOpen(true);
    }
  }, [hairCount]);

  return (
    <div className="relative mb-8 flex items-center justify-center w-64 h-64 overflow-visible">
      <div
        onPointerDown={handleUltimateAction}
        className="relative w-full h-full rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-visible border-4 border-stone-300 dark:border-stone-800 cursor-pointer bg-stone-50 dark:bg-stone-900"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full transition-all duration-300 overflow-visible">
          <rect width="100" height="100" className="fill-stone-200 dark:fill-[#1c1917]" />
          <path d="M0 25 H100 M0 50 H100 M0 75 H100 M25 0 V100 M50 0 V100 M75 0 V100" className="stroke-stone-300 dark:stroke-[#141210]" strokeWidth="0.5" />
          <path d="M25 100 L50 72 L75 100 Z" className="fill-stone-300 dark:fill-[#24201e] stroke-stone-400" strokeWidth="1.5" />
          <path d="M30 38 L70 38 L66 78 L50 86 L34 78 Z" className="fill-stone-400 dark:fill-[#6e6761] stroke-stone-500" strokeWidth="2" />
          <path d="M34 62 L50 87 L66 62 L58 76 L50 81 L42 76 Z" fill="#000000" stroke="#000000" strokeWidth="1.5" />
          <path d="M38 62 L50 80 L62 62 Z" fill="#000000" opacity="0.4" />
          <path d="M38 52 L46 51 M54 51 L62 52" stroke="#000" strokeWidth="3" strokeLinecap="round" />
          <path d="M47 48 L53 48 L50 63 Z" className="fill-stone-500 stroke-stone-600" strokeWidth="0.5" />
          {hairCount === 0 ? (
            <path d="M43 69 Q50 76 57 69" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M43 71 L57 71" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          )}
          <g fill="#000000" stroke="#000000" strokeWidth="0.5">
            {hairPercentage >= 75 && <path d="M26 35 L34 20 L50 15 L66 20 L74 35 L64 38 L50 36 L36 38 Z" />}
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
        </svg>

        {/* 🚨 [얼굴 칸 내부 리셋 트랩 UI] */}
        {hairCount <= 100 && hairCount > 0 && isResetPanelOpen && (
          <div className="absolute inset-0 flex items-center justify-center p-3 bg-stone-900/80 dark:bg-stone-950/80 z-40 animate-fade-in rounded-xl">
            <div className="relative w-full h-full flex flex-col items-center justify-center border-2 border-red-500 rounded-lg p-2 bg-stone-950 text-center">
              <button
                onPointerDown={(e) => {
                  e.stopPropagation(); 
                  setIsResetPanelOpen(false); 
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-stone-800 text-stone-300 font-sans font-black text-[11px] rounded-full border border-stone-600 hover:bg-red-600 active:scale-90 transition-all cursor-pointer z-50"
              >
                ✕
              </button>
              <button
                onPointerDown={(e) => {
                  e.stopPropagation(); 
                  resetGame();
                }}
                className="w-full h-4/5 flex flex-col items-center justify-center bg-red-600 hover:bg-red-700 text-white font-black rounded border border-black shadow-[0_4px_0_#000] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer px-2"
              >
                <span className="text-sm tracking-tighter mb-0.5">🚨 모근 공장초기화 🚨</span>
                <span className="text-[9px] text-red-200 font-normal tracking-normal">(광클 금지 구역)</span>
              </button>
            </div>
          </div>
        )}

        {hairCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-40 bg-stone-100/10 dark:bg-black/10 backdrop-blur-[1px] animate-fade-in rounded-xl">
            <button
              onPointerDown={(e) => {
                e.stopPropagation(); 
                resetGame();
              }}
              className="w-full h-full flex items-center justify-center text-stone-900 dark:text-stone-100 font-black text-2xl tracking-widest uppercase cursor-pointer active:scale-95 transition-transform bg-transparent"
            >
              🔄 다시 하기
            </button>
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateY(40px)' }}>
        <FloatingText messages={messages} />
      </div>
    </div>
  );
}