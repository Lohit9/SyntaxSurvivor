import { useState, useCallback, useRef, useEffect } from 'react'
import { useGameLoop } from './useGameLoop'
import {
  GameEngineState,
  createInitialState,
  spawnEnemy,
  updateEnemies,
  setPlayerInput,
  checkWordMatch,
  startGame,
  resetGame,
  ENEMY_SPAWN_INTERVAL
} from '../game/GameEngine'

export function useGameEngine() {
  const [state, setState] = useState<GameEngineState>(createInitialState)
  const lastSpawnTimeRef = useRef<number>(0)
  const elapsedTimeRef = useRef<number>(0)

  const isPlaying = state.gameState === 'playing'

  // Game loop update function
  const update = useCallback((deltaTime: number) => {
    elapsedTimeRef.current += deltaTime

    setState(currentState => {
      // Spawn enemy every ENEMY_SPAWN_INTERVAL ms
      let newState = currentState
      
      if (elapsedTimeRef.current - lastSpawnTimeRef.current >= ENEMY_SPAWN_INTERVAL) {
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

  // Reset timers when game starts
  useEffect(() => {
    if (isPlaying) {
      lastSpawnTimeRef.current = 0
      elapsedTimeRef.current = 0
    }
  }, [isPlaying])

  // Actions
  const handleStartGame = useCallback(() => {
    setState(startGame)
  }, [])

  const handleResetGame = useCallback(() => {
    setState(resetGame)
  }, [])

  const handleInputChange = useCallback((input: string) => {
    setState(currentState => setPlayerInput(currentState, input))
  }, [])

  const handleSubmitWord = useCallback(() => {
    setState(currentState => checkWordMatch(currentState))
  }, [])

  return {
    ...state,
    startGame: handleStartGame,
    resetGame: handleResetGame,
    setPlayerInput: handleInputChange,
    submitWord: handleSubmitWord
  }
}

export default useGameEngine

