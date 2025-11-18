import { Settings, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePomodoro } from '@/features/pomodoro/context/pomodoro-context'
import { playNotificationSound, type SoundType } from '@/lib/audio/audio-manager'
import type { PomodoroSettings } from '@/features/pomodoro/types/pomodoro'

export function SettingsDialog() {
  const { state, dispatch } = usePomodoro()

  const handleSoundEnabledChange = (checked: boolean) => {
    const newSettings: PomodoroSettings = {
      ...state.settings,
      soundEnabled: checked,
    }
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })
  }

  const handleNotificationEnabledChange = (checked: boolean) => {
    const newSettings: PomodoroSettings = {
      ...state.settings,
      notificationEnabled: checked,
    }
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })
  }

  const handleSoundSelectionChange = (value: string) => {
    const newSettings: PomodoroSettings = {
      ...state.settings,
      soundSelection: value,
    }
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })
  }

  const handleSoundDurationChange = (value: string) => {
    const newSettings: PomodoroSettings = {
      ...state.settings,
      soundDuration: parseInt(value, 10),
    }
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })
  }

  const handleTestSound = () => {
    const soundType = (state.settings.soundSelection || 'default') as SoundType
    const soundDuration = state.settings.soundDuration || 1
    playNotificationSound(soundType, soundDuration).catch((error) => {
      console.error('Failed to play test sound:', error)
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
          <DialogDescription>
            Configure your timer preferences for focus sessions and breaks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Sound Enabled */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="sound-enabled" className="flex flex-col space-y-1">
              <span>Sound Alerts</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs">
                Play a sound when sessions complete
              </span>
            </Label>
            <Switch
              id="sound-enabled"
              checked={state.settings.soundEnabled}
              onCheckedChange={handleSoundEnabledChange}
            />
          </div>

          {/* Sound Selection */}
          {state.settings.soundEnabled && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="sound-selection">Sound Type</Label>
                <div className="flex gap-2">
                  <Select
                    value={state.settings.soundSelection}
                    onValueChange={handleSoundSelectionChange}
                  >
                    <SelectTrigger id="sound-selection">
                      <SelectValue placeholder="Select a sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Single Tone)</SelectItem>
                      <SelectItem value="beep">Beep (Double Beep)</SelectItem>
                      <SelectItem value="chime">Chime (Three Notes)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleTestSound}
                    title="Test sound"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span className="sr-only">Test sound</span>
                  </Button>
                </div>
              </div>

              {/* Sound Duration */}
              <div className="grid gap-2">
                <Label htmlFor="sound-duration">Sound Duration</Label>
                <Select
                  value={String(state.settings.soundDuration)}
                  onValueChange={handleSoundDurationChange}
                >
                  <SelectTrigger id="sound-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Short (1 second)</SelectItem>
                    <SelectItem value="2">Medium (2 seconds)</SelectItem>
                    <SelectItem value="3">Long (3 seconds)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Notification Enabled */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notification-enabled" className="flex flex-col space-y-1">
              <span>Browser Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs">
                Show popup notifications when sessions complete
              </span>
            </Label>
            <Switch
              id="notification-enabled"
              checked={state.settings.notificationEnabled}
              onCheckedChange={handleNotificationEnabledChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
