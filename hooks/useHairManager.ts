'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { playSound, getRandomScript } from '@/lib/utils';
import { FloatingMessage } from '@/components/game/FloatingText';

export interface FallingHair {
  id: string;
  x: number; 
  y: number; 
  angle: number;
  driftX: number;
  curveDir: number;
}

export function useHairManager() {
  const [messages, setMessages] = useState<FloatingMessage[]>([]);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [fallingHairs, setFallingHairs] = useState<FallingHair[]>([]);
  
  const { hairCount, depilate } = useGameStore();

  const handleUltimateAction = (): void => {
    if (hairCount === 0) return; 

    try {
      playSound('/assets/sounds/pluck.mp3');
    } catch (e) {}

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

    // ✨ 형이 만족했던 끊김 없는 부드러운 뷰포트 낙하 물리 좌표값 설정
    const hairId = `hair-${Date.now()}-${Math.random()}`;
    const newHair: FallingHair = {
      id: hairId,
      x: 42 + Math.random() * 16,           
      y: 40 + Math.random() * 5,            
      angle: (Math.random() - 0.5) * 180,   
      driftX: (Math.random() - 0.5) * 180,  
      curveDir: Math.random() > 0.5 ? 1 : -1
    };

    setFallingHairs((prev) => [...prev, newHair]);
    setTimeout(() => {
      setFallingHairs((prev) => prev.filter((h) => h.id !== hairId));
    }, 4000); 
  };

  return {
    messages,
    isShaking,
    fallingHairs,
    handleUltimateAction
  };
}