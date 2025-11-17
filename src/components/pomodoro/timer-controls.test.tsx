import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerControls } from './timer-controls'

describe('TimerControls', () => {
  it('should render start button when timer is idle', () => {
    render(
      <TimerControls
        timerState="idle"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('should render pause button when timer is running', () => {
    render(
      <TimerControls
        timerState="running"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('should render resume button when timer is paused', () => {
    render(
      <TimerControls
        timerState="paused"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
  })

  it('should call onStart when start button is clicked', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()

    render(
      <TimerControls
        timerState="idle"
        onStart={onStart}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /start/i }))

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('should call onPause when pause button is clicked', async () => {
    const user = userEvent.setup()
    const onPause = vi.fn()

    render(
      <TimerControls
        timerState="running"
        onStart={vi.fn()}
        onPause={onPause}
        onReset={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /pause/i }))

    expect(onPause).toHaveBeenCalledTimes(1)
  })

  it('should call onReset when reset button is clicked', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()

    render(
      <TimerControls
        timerState="running"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={onReset}
      />
    )

    await user.click(screen.getByRole('button', { name: /reset/i }))

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should disable reset button when timer is idle', () => {
    render(
      <TimerControls
        timerState="idle"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled()
  })

  it('should enable reset button when timer is running', () => {
    render(
      <TimerControls
        timerState="running"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /reset/i })).not.toBeDisabled()
  })

  it('should show next session button when timer is completed', () => {
    render(
      <TimerControls
        timerState="completed"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        onNext={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('should call onNext when next button is clicked', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()

    render(
      <TimerControls
        timerState="completed"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        onNext={onNext}
      />
    )

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  describe('Skip Button', () => {
    it('should show skip button when onSkip is provided and timer is idle', () => {
      render(
        <TimerControls
          timerState="idle"
          onStart={vi.fn()}
          onPause={vi.fn()}
          onReset={vi.fn()}
          onSkip={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('should show skip button when onSkip is provided and timer is running', () => {
      render(
        <TimerControls
          timerState="running"
          onStart={vi.fn()}
          onPause={vi.fn()}
          onReset={vi.fn()}
          onSkip={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('should show skip button when onSkip is provided and timer is paused', () => {
      render(
        <TimerControls
          timerState="paused"
          onStart={vi.fn()}
          onPause={vi.fn()}
          onReset={vi.fn()}
          onSkip={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('should not show skip button when timer is completed', () => {
      render(
        <TimerControls
          timerState="completed"
          onStart={vi.fn()}
          onPause={vi.fn()}
          onReset={vi.fn()}
          onSkip={vi.fn()}
        />
      )

      expect(screen.queryByRole('button', { name: /^skip$/i })).not.toBeInTheDocument()
    })

    it('should not show skip button when onSkip is not provided', () => {
      render(
        <TimerControls
          timerState="running"
          onStart={vi.fn()}
          onPause={vi.fn()}
          onReset={vi.fn()}
        />
      )

      expect(screen.queryByRole('button', { name: /^skip$/i })).not.toBeInTheDocument()
    })

    it('should call onSkip when skip button is clicked', async () => {
      const user = userEvent.setup()
      const onSkip = vi.fn()

      render(
        <TimerControls
          timerState="running"
          onStart={vi.fn()}
          onPause={vi.fn()}
          onReset={vi.fn()}
          onSkip={onSkip}
        />
      )

      await user.click(screen.getByRole('button', { name: /skip/i }))

      expect(onSkip).toHaveBeenCalledTimes(1)
    })
  })
})
