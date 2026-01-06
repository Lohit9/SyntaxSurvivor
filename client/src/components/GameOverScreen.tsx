import { useState } from 'react'
import { Leaderboard } from './Leaderboard'

interface GameOverScreenProps {
  score: number
  onPlayAgain: () => void
}

export function GameOverScreen({ score, onPlayAgain }: GameOverScreenProps) {
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), score }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit score')
      }

      setSubmitted(true)
      setRefreshTrigger((t) => t + 1)
    } catch {
      setError('Failed to submit score. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cyber-dark/95 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-8 max-h-screen overflow-y-auto">
        {/* Game Over Title */}
        <div className="text-center">
          <h1 className="font-display text-5xl font-black text-neon-red mb-2">
            GAME OVER
          </h1>
          <p className="text-gray-400 font-body text-lg">
            The bugs got through! 🐛
          </p>
        </div>

        {/* Final Score */}
        <div className="glass-panel rounded-xl p-8 text-center glow-magenta">
          <p className="text-gray-400 uppercase tracking-wider text-sm mb-2">Final Score</p>
          <p className="font-display text-6xl font-black text-neon-yellow">
            {score.toLocaleString()}
          </p>
        </div>

        {/* Submit Score Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-display text-lg font-bold text-neon-cyan mb-4 text-center">
              Save Your Score
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm text-gray-400 mb-2">
                  Enter your name
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={50}
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-cyber-darker border border-neon-cyan/30
                    text-white font-body text-lg
                    focus:outline-none focus:border-neon-cyan focus:glow-cyan
                    transition-all duration-200
                    placeholder-gray-500
                  "
                  placeholder="YourName"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <p className="text-neon-red text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full font-display text-lg font-bold
                  px-6 py-3 rounded-lg
                  bg-gradient-to-r from-neon-green to-neon-cyan
                  text-cyber-dark
                  hover:scale-[1.02] hover:shadow-lg hover:shadow-neon-green/30
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </button>
            </div>
          </form>
        ) : (
          <div className="glass-panel rounded-xl p-6 text-center">
            <p className="text-neon-green font-display text-lg">
              ✓ Score submitted!
            </p>
          </div>
        )}

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="
            font-display text-xl font-bold
            px-10 py-3 rounded-xl
            bg-gradient-to-r from-neon-magenta to-neon-cyan
            text-cyber-dark
            hover:scale-105 hover:shadow-lg hover:shadow-neon-magenta/50
            active:scale-95
            transition-all duration-200
          "
        >
          PLAY AGAIN
        </button>

        {/* Leaderboard */}
        <Leaderboard refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}

export default GameOverScreen

