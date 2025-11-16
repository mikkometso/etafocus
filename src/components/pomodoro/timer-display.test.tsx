import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from './timer-display'

describe('TimerDisplay', () => {
  it('should render formatted time correctly', () => {
    render(<TimerDisplay timeRemaining={1500} sessionType="work" />)

    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('should display work session label', () => {
    render(<TimerDisplay timeRemaining={1500} sessionType="work" />)

    expect(screen.getByText('Focus Time')).toBeInTheDocument()
  })

  it('should display short break session label', () => {
    render(<TimerDisplay timeRemaining={300} sessionType="short-break" />)

    expect(screen.getByText('Short Break')).toBeInTheDocument()
  })

  it('should display long break session label', () => {
    render(<TimerDisplay timeRemaining={900} sessionType="long-break" />)

    expect(screen.getByText('Long Break')).toBeInTheDocument()
  })

  it('should format single digit seconds with leading zero', () => {
    render(<TimerDisplay timeRemaining={65} sessionType="work" />)

    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  it('should display 00:00 when time is zero', () => {
    render(<TimerDisplay timeRemaining={0} sessionType="work" />)

    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('should have different styling for different session types', () => {
    const { rerender, container } = render(
      <TimerDisplay timeRemaining={300} sessionType="work" />
    )

    const workClasses = (container.firstChild as HTMLElement)?.className

    rerender(<TimerDisplay timeRemaining={300} sessionType="short-break" />)
    const breakClasses = (container.firstChild as HTMLElement)?.className

    expect(workClasses).not.toBe(breakClasses)
  })

  it('should render progress indicator', () => {
    render(<TimerDisplay timeRemaining={750} sessionType="work" progress={0.5} />)

    // Progress indicator should be present
    const progressElement = screen.getByRole('progressbar')
    expect(progressElement).toBeInTheDocument()
    expect(progressElement).toHaveAttribute('aria-valuenow', '50')
  })
})
