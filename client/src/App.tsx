import { useGameEngine } from './hooks/useGameEngine'
import { GameCanvas } from './components/GameCanvas'
import { HUD } from './components/HUD'
import { StartScreen } from './components/StartScreen'
import { GameOverScreen } from './components/GameOverScreen'

function App() {
  const {
    enemies,
    targetedEnemyId,
    typedLetters,
    gameState,
    score,
    isShaking,
    startGame,
    resetGame,
  } = useGameEngine()

  // For now, lives is static (could be expanded later)
  const lives = 3

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* HUD - always visible during gameplay */}
      {gameState === 'playing' && (
        <HUD score={score} lives={lives} typedLetters={typedLetters} />
      )}

      {/* Game Canvas - always visible */}
      <GameCanvas
        enemies={enemies}
        targetedEnemyId={targetedEnemyId}
        typedLetters={typedLetters}
        isShaking={isShaking}
      />

      {/* Start Screen Overlay */}
      {gameState === 'idle' && <StartScreen onStart={startGame} />}

      {/* Game Over Screen Overlay */}
      {gameState === 'game-over' && (
        <GameOverScreen score={score} onPlayAgain={resetGame} />
      )}
    </div>
  )
}

export default App
