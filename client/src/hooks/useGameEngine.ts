import { useState, useCallback, useRef, useEffect } from 'react'
import { useGameLoop } from './useGameLoop'
import {
  GameEngineState,
  createInitialState,
  spawnEnemy,
  updateEnemies,
  handleKeyPress,
  clearShake,
  resetGame,
  ENEMY_SPAWN_INTERVAL,
  SHAKE_DURATION
} from '../game/GameEngine'

export function useGameEngine() {
  const [state, setState] = useState<GameEngineState>(createInitialState)
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isPlaying = state.gameState === 'playing'
  const isGameOver = state.gameState === 'game-over'

  // ============================================
  // Enemy Spawning - useEffect with setInterval
  // ============================================
  // Triggers when gameState becomes 'playing'
  // Spawns a new enemy every ENEMY_SPAWN_INTERVAL milliseconds
  // Clears interval when gameState changes to 'game-over' or component unmounts
  useEffect(() => {
    if (isPlaying) {
      // Set up interval to spawn enemies
      spawnIntervalRef.current = setInterval(() => {
        setState(currentState => {
          // Double-check we're still playing (defensive check)
          if (currentState.gameState !== 'playing') {
            return currentState
          }
          return spawnEnemy(currentState)
        })
      }, ENEMY_SPAWN_INTERVAL)
    }

    // Cleanup: clear interval when game ends or component unmounts
    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current)
        spawnIntervalRef.current = null
      }
    }
  }, [isPlaying])

  // Also clear interval immediately when game-over occurs
  useEffect(() => {
    if (isGameOver && spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current)
      spawnIntervalRef.current = null
    }
  }, [isGameOver])

  // ============================================
  // Enemy Movement & Collision - requestAnimationFrame
  // ============================================
  // Runs every frame via useGameLoop
  // Handles enemy movement and checks for collision with bottom
  const update = useCallback((deltaTime: number) => {
    setState(currentState => {
      // Only update if game is playing
      if (currentState.gameState !== 'playing') {
        return currentState
      }

      // Update enemy positions and check for game-over condition
      return updateEnemies(currentState, deltaTime)
    })
  }, [])

  // Use the requestAnimationFrame-based game loop
  useGameLoop(update, isPlaying)

  // ============================================
  // Shake Effect Cleanup
  // ============================================
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current)
      }
    }
  }, [])

  // ============================================
  // Keyboard Input Handling
  // ============================================
  const onKeyPress = useCallback((key: string) => {
    setState(currentState => {
      if (currentState.gameState !== 'playing') {
        return currentState
      }

      const result = handleKeyPress(currentState, key)

      // If wrong letter, set up shake timeout to clear it
      if (!result.wasCorrect && result.state.isShaking) {
        // Clear any existing timeout
        if (shakeTimeoutRef.current) {
          clearTimeout(shakeTimeoutRef.current)
        }

        shakeTimeoutRef.current = setTimeout(() => {
          setState(s => clearShake(s))
        }, SHAKE_DURATION)
      }

      return result.state
    })
  }, [])

  // Global keydown listener - only active when playing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if modifier keys are pressed (except shift for capitals)
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return
      }

      // Only handle letter keys
      if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault()
        onKeyPress(event.key)
      }
    }

    if (isPlaying) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPlaying, onKeyPress])

  // ============================================
  // Game Actions
  // ============================================
  const handleStartGame = useCallback(() => {
    // Start game with first enemy already spawned
    setState(() => {
      const initialState = {
        ...createInitialState(),
        gameState: 'playing' as const
      }
      // Spawn first enemy immediately so player doesn't wait
      return spawnEnemy(initialState)
    })
  }, [])

  const handleResetGame = useCallback(() => {
    // Clear any running interval
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current)
      spawnIntervalRef.current = null
    }
    setState(resetGame)
  }, [])

  return {
    // State
    enemies: state.enemies,
    targetedEnemyId: state.targetedEnemyId,
    typedLetters: state.typedLetters,
    gameState: state.gameState,
    score: state.score,
    isShaking: state.isShaking,
    // Actions
    startGame: handleStartGame,
    resetGame: handleResetGame
  }
}

export default useGameEngine
