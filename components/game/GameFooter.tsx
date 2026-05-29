'use client';

interface GameFooterProps {
  isPremium: boolean;
}

export function GameFooter({ isPremium }: GameFooterProps) {
  if (isPremium) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-stone-200 dark:bg-stone-900 border-t border-stone-300 dark:border-stone-800 flex items-center justify-center py-2 px-4 z-40">
      <div className="w-full max-w-[468px] min-h-[60px] bg-white dark:bg-stone-950 flex items-center justify-center relative rounded overflow-hidden">
        <p className="text-[10px] text-stone-400 font-sans"></p>
      </div>
    </div>
  );
}