export function ScoreDisplay({ scores }: { scores: string[] }) {
  // Dynamically calculate the size based on the number of scores
  const circleSize =
    scores.length > 5
      ? "w-12 h-12 sm:w-16 sm:h-16"
      : "w-16 h-16 sm:w-20 sm:h-20";
  const innerCircleSize =
    scores.length > 5
      ? "w-10 h-10 sm:w-12 sm:h-12"
      : "w-14 h-14 sm:w-16 sm:h-16";
  const fontSize =
    scores.length > 5 ? "text-base sm:text-lg" : "text-lg sm:text-2xl";

  return (
    <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 flex-wrap">
      {scores.map((score, index) => (
        <div key={index} className="relative flex items-center justify-center">
          <div
            className={`rounded-full bg-gray-100 flex items-center justify-center shadow-lg border-4 border-[#0a1765] ${circleSize}`}
          >
            <div
              className={`rounded-full bg-gray-100 flex items-center justify-center border-2 ${innerCircleSize}`}
            >
              <span className={`text-[#000080] font-bold ${fontSize}`}>
                {score}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}