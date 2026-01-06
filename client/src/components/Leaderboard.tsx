import { useState, useEffect } from 'react'

interface HighScore {
  id: number
  username: string
  score: number
  timestamp: string
}

interface LeaderboardProps {
  refreshTrigger?: number
}

export function Leaderboard({ refreshTrigger }: LeaderboardProps) {
  const [scores, setScores] = useState<HighScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/scores')
      .then((res) => res.json())
      .then((data) => {
        setScores(data.scores || [])
        setError(null)
      })
      .catch(() => {
        setError('Failed to load leaderboard')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 w-full max-w-sm">
        <h3 className="font-display text-lg font-bold text-neon-cyan mb-4 text-center">
          🏆 Leaderboard
        </h3>
        <p className="text-center text-gray-400">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-6 w-full max-w-sm">
        <h3 className="font-display text-lg font-bold text-neon-cyan mb-4 text-center">
          🏆 Leaderboard
        </h3>
        <p className="text-center text-neon-red">{error}</p>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-xl p-6 w-full max-w-sm">
      <h3 className="font-display text-lg font-bold text-neon-cyan mb-4 text-center">
        🏆 Leaderboard
      </h3>

      {scores.length === 0 ? (
        <p className="text-center text-gray-400">No scores yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className={`
                flex items-center justify-between px-4 py-2 rounded-lg
                ${index === 0 ? 'bg-neon-yellow/10 border border-neon-yellow/30' : ''}
                ${index === 1 ? 'bg-gray-400/10 border border-gray-400/30' : ''}
                ${index === 2 ? 'bg-amber-600/10 border border-amber-600/30' : ''}
                ${index > 2 ? 'bg-white/5' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg w-6 text-center">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && <span className="text-gray-500">{index + 1}</span>}
                </span>
                <span className="font-body font-semibold truncate max-w-[120px]">
                  {score.username}
                </span>
              </div>
              <span className="font-display font-bold text-neon-cyan">
                {score.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Leaderboard

