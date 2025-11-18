import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { PomodoroState } from '../types/pomodoro'
import { pomodoroReducer, type PomodoroAction } from './pomodoro-reducer'
import { getDefaultSettings } from '../utils/timer'
import { LocalStorage, StorageKeys } from '@/lib/storage/local-storage'

type PomodoroContextType = {
  state: PomodoroState
  dispatch: React.Dispatch<PomodoroAction>
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

type PomodoroProviderProps = {
  children: ReactNode
}

function getInitialState(): PomodoroState {
  // Try to load state from localStorage
  const savedState = LocalStorage.get<Partial<PomodoroState>>(StorageKeys.POMODORO_STATE)

  if (savedState) {
    // Migration: Add missing fields if they don't exist
    const migratedState: PomodoroState = {
      ...savedState,
      workSessionsToday: savedState.workSessionsToday ?? savedState.pomodorosCompletedToday ?? 0,
      settings: {
        ...savedState.settings,
        soundDuration: savedState.settings?.soundDuration ?? 1,
      },
    } as PomodoroState
    return migratedState
  }

  // Return default state
  const defaultSettings = getDefaultSettings()
  return {
    currentSessionType: 'work',
    timerState: 'idle',
    timeRemaining: defaultSettings.workDuration,
    pomodorosCompletedToday: 0,
    workSessionsToday: 0,
    currentStreak: 0,
    sessions: [],
    settings: defaultSettings,
  }
}

export function PomodoroProvider({ children }: PomodoroProviderProps) {
  const [state, dispatch] = useReducer(pomodoroReducer, undefined, getInitialState)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    LocalStorage.set(StorageKeys.POMODORO_STATE, state)
  }, [state])

  return (
    <PomodoroContext.Provider value={{ state, dispatch }}>
      {children}
    </PomodoroContext.Provider>
  )
}

export function usePomodoro() {
  const context = useContext(PomodoroContext)

  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider')
  }

  return context
}
