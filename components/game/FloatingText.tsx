'use client';

export interface FloatingMessage {
  id: string;
  text: string;
  x: number;
  y: number;
  delay: number;
}

interface FloatingTextProps {
  messages: FloatingMessage[];
}

/**
 * [은은한 유기적 텍스트 이펙트 컴포넌트]
 * 입 주변에서 글자가 아주 천천히 피어나 서서히 퍼져나가다 흐릿하게 사라지는 연출입니다.
 */
export function FloatingText({ messages }: FloatingTextProps) {
  return (
    <div className="absolute pointer-events-none select-none z-50 w-full h-full flex items-center justify-center">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slow-fade-bloom {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.6);
          }
          20% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1);
          }
          80% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            /* 아주 느리고 좁은 범위로 최종 좌표까지 이동 */
            transform: translate(var(--target-x), var(--target-y)) scale(0.95);
          }
        }

        /* 연기처럼 좌우로 흔들거리며 일렁이는 애니메이션 */
        @keyframes slow-drift {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          33% { transform: translateX(-4px) translateY(-2px); }
          66% { transform: translateX(4px) translateY(1px); }
        }

        .text-bloom-effect {
          /* 2.2초 동안 아주 천천히 흐르도록 설정 */
          animation: slow-fade-bloom 2.2s cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }

        .text-drift-effect {
          animation: slow-drift 3s ease-in-out infinite;
        }
      `}} />

      {messages.map((msg) => (
        <div
          key={msg.id}
          className="absolute text-bloom-effect"
          style={{
            '--target-x': `${msg.x}px`,
            '--target-y': `${msg.y}px`,
            left: '50%',
            top: '56%', // 입 위치에 싱크 정밀 고정
          } as any}
        >
          <div 
            className="text-drift-effect font-bold text-sm tracking-tight text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] text-center whitespace-nowrap"
            style={{ animationDelay: `${msg.delay}s` }}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}