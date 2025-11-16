import { PomodoroProvider } from '@/features/pomodoro/context/pomodoro-context'
import { PomodoroPage } from '@/components/pomodoro/pomodoro-page'

function App() {
  return (
    <PomodoroProvider>
      <div className="min-h-screen bg-background text-foreground">
        <PomodoroPage />
      </div>
    </PomodoroProvider>
  )
}

export default App
