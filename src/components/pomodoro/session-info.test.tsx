import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SessionInfo } from './session-info'

describe('SessionInfo', () => {
  it('should display pomodoros completed today', () => {
    render(<SessionInfo pomodorosCompleted={3} currentStreak={1} nextSessionType="work" />)

    expect(screen.getByText(/completed today/i)).toBeInTheDocument()
    const numbers = screen.getAllByText('3')
    expect(numbers.length).toBeGreaterThan(0)
  })

  it('should display current streak', () => {
    render(<SessionInfo pomodorosCompleted={5} currentStreak={2} nextSessionType="work" />)

    expect(screen.getByText(/2 days streak/i)).toBeInTheDocument()
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
  })

  it('should display next session type', () => {
    render(
      <SessionInfo pomodorosCompleted={1} currentStreak={1} nextSessionType="short-break" />
    )

    expect(screen.getByText(/next/i)).toBeInTheDocument()
    expect(screen.getByText(/short break/i)).toBeInTheDocument()
  })

  it('should show work session as next', () => {
    render(<SessionInfo pomodorosCompleted={1} currentStreak={1} nextSessionType="work" />)

    expect(screen.getByText(/focus time/i)).toBeInTheDocument()
  })

  it('should show long break as next', () => {
    render(<SessionInfo pomodorosCompleted={3} currentStreak={1} nextSessionType="long-break" />)

    expect(screen.getByText(/long break/i)).toBeInTheDocument()
  })

  it('should handle zero pomodoros completed', () => {
    render(<SessionInfo pomodorosCompleted={0} currentStreak={0} nextSessionType="work" />)

    expect(screen.getByText(/completed today/i)).toBeInTheDocument()
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThan(0)
  })

  it('should pluralize day correctly for single day streak', () => {
    render(<SessionInfo pomodorosCompleted={1} currentStreak={1} nextSessionType="work" />)

    expect(screen.getByText(/1 day streak/i)).toBeInTheDocument()
  })

  it('should pluralize days correctly for multiple day streak', () => {
    render(<SessionInfo pomodorosCompleted={10} currentStreak={5} nextSessionType="work" />)

    expect(screen.getByText(/5 days streak/i)).toBeInTheDocument()
  })
})
