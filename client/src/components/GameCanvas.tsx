import { Enemy } from '../game/GameEngine'

interface GameCanvasProps {
  enemies: Enemy[]
  targetedEnemyId: string | null
  typedLetters: string
  isShaking: boolean
}

interface EnemyWordProps {
  enemy: Enemy
  isTargeted: boolean
  typedLetters: string
}

function EnemyWord({ enemy, isTargeted, typedLetters }: EnemyWordProps) {
  const word = enemy.word

  return (
    <div
      className="absolute flex items-center gap-2 animate-float-down"
      style={{
        left: `${enemy.x}px`,
        top: `${enemy.y}px`,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Bug emoji */}
      <span className="text-2xl">🐛</span>
      
      {/* Word with letter highlighting */}
      <span
        className={`
          font-display text-xl font-bold tracking-wider
          px-3 py-1 rounded-lg
          ${isTargeted 
            ? 'glass-panel border-neon-cyan glow-cyan' 
            : 'glass-panel'
          }
        `}
      >
        {word.split('').map((letter, index) => {
          const isTyped = isTargeted && index < typedLetters.length
          return (
            <span
              key={index}
              className={`
                transition-colors duration-100
                ${isTyped 
                  ? 'text-neon-green text-glow-green' 
                  : 'text-white'
                }
              `}
            >
              {letter}
            </span>
          )
        })}
      </span>
    </div>
  )
}

export function GameCanvas({ enemies, targetedEnemyId, typedLetters, isShaking }: GameCanvasProps) {
  return (
    <div
      className={`
        relative w-[800px] h-[600px] mx-auto
        bg-cyber-darker/50 rounded-2xl
        border border-neon-cyan/20
        overflow-hidden
        ${isShaking ? 'animate-shake' : ''}
      `}
      style={{
        background: `
          radial-gradient(circle at 50% 100%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 20% 20%, rgba(0, 255, 245, 0.05) 0%, transparent 40%),
          rgba(5, 5, 8, 0.8)
        `,
      }}
    >
      {/* Grid lines for visual effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 245, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 245, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Danger zone at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background: 'linear-gradient(to top, rgba(255, 51, 102, 0.3), transparent)',
        }}
      />
      <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-neon-red/50" />

      {/* Enemies */}
      {enemies.map((enemy) => (
        <EnemyWord
          key={enemy.id}
          enemy={enemy}
          isTargeted={enemy.id === targetedEnemyId}
          typedLetters={typedLetters}
        />
      ))}

      {/* Empty state message */}
      {enemies.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 font-body text-lg">Enemies incoming...</p>
        </div>
      )}
    </div>
  )
}

export default GameCanvas

