'use client';

import { CSSProperties, useState, useEffect } from 'react';
import { FloatingText, FloatingMessage } from '@/components/game/FloatingText';

interface FallingHair {
  id: string;
  x: number;
  y: number;
  angle: number;
  driftX: number;
  curveDir: number;
}

interface HairCustomProperties extends CSSProperties {
  '--init-deg'?: string;
  '--spin-deg'?: string;
  '--drift-x'?: string;
}

interface WigAvatarProps {
  hairCount: number;
  hairPercentage: number;
  fallingHairs: FallingHair[];
  handleUltimateAction: () => void;
  messages: FloatingMessage[];
  resetGame: () => void;
}

export function WigAvatar({
  hairCount,
  hairPercentage,
  fallingHairs,
  handleUltimateAction,
  messages,
  resetGame,
}: WigAvatarProps) {
  // 📍 초기화 트랩 창이 열려있는지 관리하는 상태 (기본값은 true)
  const [isResetPanelOpen, setIsResetPanelOpen] = useState<boolean>(true);

  // 📍 혹시 리셋을 완료해서 숫자가 다시 올라가면 패널을 자동으로 열림 상태로 복구해둡니다.
  useEffect(() => {
    if (hairCount > 100) {
      setIsResetPanelOpen(true);
    }
  }, [hairCount]);

  return (
    <div className="relative mb-8 flex items-center justify-center w-64 h-64">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes hair-smooth-continuous-fall {
          0% { opacity: 1; transform: translateY(0) translateX(0) rotate(var(--init-deg)) scaleY(1); }
          15% { transform: translateY(-40px) translateX(calc(var(--drift-x) * 0.2)) rotate(calc(var(--init-deg) + 90deg)) scaleY(1.1); }
          100% { opacity: 0; transform: translateY(280px) translateX(var(--drift-x)) rotate(calc(var(--init-deg) + var(--spin-deg))) scaleY(0.9); }
        }
        .parabolic-hair-style { animation: hair-smooth-continuous-fall 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
      `}} />

      <div
        onPointerDown={handleUltimateAction}
        className="relative w-full h-full rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden border-4 border-stone-300 dark:border-stone-800 cursor-pointer bg-stone-50 dark:bg-stone-900"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full transition-all duration-300">
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

        {/* 머리카락 낙하 구역 */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {fallingHairs.map((hair) => {
            const spinDegrees = hair.curveDir * (360 + Math.random() * 360);
            const hairInlineStyle: HairCustomProperties = {
              left: `${hair.x}px`,
              top: `${hair.y}px`,
              width: '14px',
              height: '22px',
              '--init-deg': `${hair.angle}deg`,
              '--spin-deg': `${spinDegrees}deg`, 
              '--drift-x': `${hair.driftX}px`
            };

            return (
              <div key={hair.id} className="absolute parabolic-hair-style pointer-events-none" style={hairInlineStyle}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d={hair.curveDir > 0 ? "M 30 0 Q 80 30, 20 60 T 50 100" : "M 70 0 Q 20 30, 80 60 T 50 100"} fill="none" stroke="currentColor" className="stroke-stone-900 dark:stroke-stone-200" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </div>
            );
          })}
        </div>

        {/* 🚨 [얼굴 칸 내부 리셋 트랩 UI] */}
        {hairCount <= 100 && hairCount > 0 && isResetPanelOpen && (
          <div className="absolute inset-0 flex items-center justify-center p-3 bg-stone-900/80 dark:bg-stone-950/80 z-40 animate-fade-in">
            <div className="relative w-full h-full flex flex-col items-center justify-center border-2 border-red-500 rounded-lg p-2 bg-stone-950 text-center">
              
              {/* ✕ 닫기 버튼: 누르면 아무 창도 안 뜨고 그냥 이 경고창 레이어만 싹 닫힘 */}
              <button
                onPointerDown={(e) => {
                  e.stopPropagation(); // 얼굴 클릭 연타 방지
                  setIsResetPanelOpen(false); // 닫기 상태로 변경하여 UI 제거
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-stone-800 text-stone-300 font-sans font-black text-[11px] rounded-full border border-stone-600 hover:bg-red-600 active:scale-90 transition-all cursor-pointer z-50"
              >
                ✕
              </button>

              {/* 중앙 기습 공장초기화 버튼: 누르면 확인창 없이 즉시 리셋 */}
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
          <div className="absolute inset-0 flex items-center justify-center z-40 bg-transparent animate-fade-in">
            <button
              onPointerDown={(e) => {
                e.stopPropagation(); // 부모 div의 handleUltimateAction 이벤트 전파 차단
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