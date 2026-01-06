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
  const lastSpawnTimeRef = useRef<number>(0)
  const elapsedTimeRef = useRef<number>(0)
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isPlaying = state.gameState === 'playing'

  // Game loop update function
  const update = useCallback((deltaTime: number) => {
    elapsedTimeRef.current += deltaTime

    setState(currentState => {
      if (currentState.gameState !== 'playing') {
        return currentState
      }

      let newState = currentState
      
      // Spawn enemy every ENEMY_SPAWN_INTERVAL ms
      const timeSinceLastSpawn = elapsedTimeRef.current - lastSpawnTimeRef.current
      if (timeSinceLastSpawn >= ENEMY_SPAWN_INTERVAL) {
        newState = spawnEnemy(newState)
        lastSpawnTimeRef.current = elapsedTimeRef.current
      }

      // Update enemy positions
      newState = updateEnemies(newState, deltaTime)

      return newState
    })
  }, [])

  // Use the game loop
  useGameLoop(update, isPlaying)

  // Clear shake timeout on cleanup
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current)
      }
    }
  }, [])

  // Handle key press
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

  // Global keydown listener
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

  // Start game action - spawn first enemy immediately
  const handleStartGame = useCallback(() => {
    // Reset timers
    lastSpawnTimeRef.current = 0
    elapsedTimeRef.current = 0
    
    // Start game with first enemy already spawned
    setState(() => {
      const initialState = {
        ...createInitialState(),
        gameState: 'playing' as const
      }
      return spawnEnemy(initialState)
    })
  }, [])

  const handleResetGame = useCallback(() => {
    lastSpawnTimeRef.current = 0
    elapsedTimeRef.current = 0
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
