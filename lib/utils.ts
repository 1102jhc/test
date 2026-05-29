import { TALK_SCRIPTS } from '@/lib/constants';

export interface TalkScriptRange {
  min: number;
  max: number;
  lines: string[];
}

export const getRandomScript = (currentCount: number): string => {
  // 0~10만 가닥 사이로 안전하게 가둡니다.
  const count = Math.max(0, Math.min(100000, currentCount));

  // 📍 [여기서부터 딱 3줄만 새로 추가하세요!]
  if (count === 0) {
    return "다 뽑으니까 속이 후련하냐? 내 머리도, 네 미래도 아주 투명하네ㅋ";
  }
  // 📍 [여기까지]

  const matchedRange = (TALK_SCRIPTS as TalkScriptRange[]).find(
    (range) => count >= range.min && count <= range.max
  );
  
  if (!matchedRange) return "어허, 손 치워라.";
  
  const randomIndex = Math.floor(Math.random() * matchedRange.lines.length);
  return matchedRange.lines[randomIndex];
};



// 전역 메모리에 오디오 상태를 보존하기 위한 필수 선언 (여기서 에러가 났던 거야!)
let audioCtx: AudioContext | null = null;
let soundBuffer: AudioBuffer | null = null;

/**
 * [사운드 엔진 초기화 함수]
 * 서버사이드가 아닌 브라우저 환경에서만 mp3를 다운로드해 디코딩합니다.
 */
export async function initSoundEngine(src: string): Promise<void> {
  if (typeof window === 'undefined' || soundBuffer) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    audioCtx = new AudioContextClass();
    const response = await fetch(src);
    if (!response.ok) return;
    
    const arrayBuffer = await response.arrayBuffer();
    audioCtx.decodeAudioData(arrayBuffer, (buffer) => {
      soundBuffer = buffer;
    });
  } catch (e) {
    console.log('사운드 엔진 초기화 우회');
  }
}

/**
 * [사운드 재생 및 모바일 햅틱 진동 융합 함수]
 */
export function playSound(src: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    // 햅틱 진동 패턴 작동
    if ('vibrate' in navigator) {
      navigator.vibrate([40, 20, 10]); 
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (audioCtx && soundBuffer) {
      const source = audioCtx.createBufferSource();
      source.buffer = soundBuffer;
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      source.start(0);
    } else {
      const fallback = new Audio(src);
      fallback.volume = 0.5;
      fallback.play().catch(() => {});
    }
  } catch (err) {
    console.log('사운드/진동 에러 무시');
  }
}