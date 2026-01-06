import { Leaderboard } from './Leaderboard'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cyber-dark/90 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-6xl font-black tracking-wider mb-2">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan bg-clip-text text-transparent">
              SYNTAX
            </span>
            <br />
            <span className="bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-magenta bg-clip-text text-transparent">
              SURVIVOR
            </span>
          </h1>
          <p className="text-gray-400 font-body text-lg mt-4">
            🐛 Squash the bugs before they reach the bottom! 🐛
          </p>
        </div>

        {/* Instructions */}
        <div className="glass-panel rounded-xl p-6 max-w-md text-center">
          <h3 className="font-display text-lg font-bold text-neon-yellow mb-4">
            How to Play
          </h3>
          <ul className="space-y-3 text-gray-300 font-body">
            <li className="flex items-center gap-3">
              <span className="text-neon-cyan">⌨️</span>
              <span>Type the keywords to destroy the bugs</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-neon-green">✓</span>
              <span>Matched letters turn <span className="text-neon-green font-bold">green</span></span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-neon-red">⚠️</span>
              <span>Don't let bugs reach the bottom!</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-neon-yellow">⚡</span>
              <span>Longer words = more points</span>
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="
            font-display text-2xl font-bold
            px-12 py-4 rounded-xl
            bg-gradient-to-r from-neon-cyan to-neon-magenta
            text-cyber-dark
            hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/50
            active:scale-95
            transition-all duration-200
            glow-cyan
          "
        >
          START GAME
        </button>

        {/* Leaderboard */}
        <Leaderboard />
      </div>
    </div>
  )
}

export default StartScreen

