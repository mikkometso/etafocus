import { Button } from '@/components/ui/button'
import type { SessionType } from '@/features/pomodoro/types/pomodoro'

type QuickPresetsProps = {
  currentSessionType: SessionType
  currentWorkDuration: number // in seconds
  currentShortBreakDuration: number // in seconds
  currentLongBreakDuration: number // in seconds
  onPresetSelect: (durationInMinutes: number, sessionType: SessionType) => void
  disabled?: boolean
}

const WORK_PRESETS = [5, 10, 15, 25] as const
const BREAK_PRESETS = [5, 10, 15] as const

export function QuickPresets({
  currentSessionType,
  currentWorkDuration,
  currentShortBreakDuration,
  currentLongBreakDuration,
  onPresetSelect,
  disabled = false,
}: QuickPresetsProps) {
  // Select presets based on session type
  const presets = currentSessionType === 'work' ? WORK_PRESETS : BREAK_PRESETS

  // Get current duration for comparison
  const getCurrentDuration = () => {
    switch (currentSessionType) {
      case 'work':
        return currentWorkDuration
      case 'short-break':
        return currentShortBreakDuration
      case 'long-break':
        return currentLongBreakDuration
    }
  }

  const currentDurationInMinutes = Math.round(getCurrentDuration() / 60)

  return (
    <div className="flex justify-center gap-4">
      {presets.map((preset) => {
        const isActive = currentDurationInMinutes === preset
        return (
          <Button
            key={preset}
            variant={isActive ? 'default' : 'outline'}
            size="lg"
            onClick={() => onPresetSelect(preset, currentSessionType)}
            disabled={disabled}
            className="rounded-full px-8"
          >
            {preset} min
          </Button>
        )
      })}
    </div>
  )
}
