export function ScoreDisplay({ scores }: { scores: string[] }) {
  // Dynamically calculate the size based on the number of scores
  const circleSize = scores.length > 5 ? "w-12 h-12 sm:w-16 sm:h-16" : "w-16 h-16 sm:w-20 sm:h-20";
  const innerCircleSize = scores.length > 5 ? "w-10 h-10 sm:w-12 sm:h-12" : "w-14 h-14 sm:w-16 sm:h-16";
  const fontSize = scores.length > 5 ? "text-base sm:text-lg" : "text-lg sm:text-2xl";

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-nowrap justify-center gap-2 sm:gap-4 max-w-[90vw] overflow-hidden">
      {scores.map((score, index) => (
        <div key={index} className="relative flex items-center justify-center">
          <div className={`rounded-full bg-gradient-to-r from-green-300 to-green-500 flex items-center justify-center shadow-lg border-4 border-white ${circleSize}`}>
            <div className={`rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center border-2 border-yellow-200 ${innerCircleSize}`}>
              <span className={`text-white font-bold ${fontSize}`}>{score}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
