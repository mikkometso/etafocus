export type TodoPriority = 'low' | 'medium' | 'high'

export type Todo = {
  id: string
  title: string
  description?: string
  priority: TodoPriority
  category?: string
  completed: boolean
  pomodorosEstimated: number
  pomodorosCompleted: number
  createdAt: Date
  completedAt?: Date
  linkedPomodoroSessions: string[]
}

export type TodoFilter = {
  status?: 'all' | 'active' | 'completed'
  priority?: TodoPriority | 'all'
  category?: string
  searchQuery?: string
}

export type TodoSort = 'priority' | 'date' | 'pomodoros' | 'title'
