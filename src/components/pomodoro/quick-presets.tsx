import { Button } from '@/components/ui/button'

type QuickPresetsProps = {
  currentWorkDuration: number // in seconds
  onPresetSelect: (durationInMinutes: number) => void
  disabled?: boolean
}

const PRESETS = [5, 10, 15, 25] as const

export function QuickPresets({ currentWorkDuration, onPresetSelect, disabled = false }: QuickPresetsProps) {
  const currentDurationInMinutes = Math.round(currentWorkDuration / 60)

  return (
    <div className="flex justify-center gap-4">
      {PRESETS.map((preset) => {
        const isActive = currentDurationInMinutes === preset
        return (
          <Button
            key={preset}
            variant={isActive ? 'default' : 'outline'}
            size="lg"
            onClick={() => onPresetSelect(preset)}
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
