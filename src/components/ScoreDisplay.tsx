export function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 z-20">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg border-4 border-white">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-200">
            <span className="text-white font-bold text-2xl">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}