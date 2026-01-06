interface HUDProps {
  score: number
  lives: number
  typedLetters: string
}

export function HUD({ score, lives, typedLetters }: HUDProps) {
  return (
    <div className="w-[800px] mx-auto mb-4 flex items-center justify-between">
      {/* Score */}
      <div className="glass-panel rounded-xl px-6 py-3 flex items-center gap-3">
        <span className="text-neon-yellow text-2xl">⚡</span>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Score</p>
          <p className="font-display text-2xl font-bold text-neon-cyan text-glow-cyan">
            {score.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Current typing indicator */}
      {typedLetters && (
        <div className="glass-panel rounded-xl px-6 py-3 glow-cyan">
          <p className="text-xs text-gray-400 uppercase tracking-wider text-center">Typing</p>
          <p className="font-display text-xl font-bold text-neon-green tracking-widest">
            {typedLetters}
            <span className="animate-pulse-glow text-neon-cyan">_</span>
          </p>
        </div>
      )}

      {/* Lives */}
      <div className="glass-panel rounded-xl px-6 py-3 flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Lives</p>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`text-2xl transition-all duration-300 ${
                  i < lives ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HUD

