import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickPresets } from './quick-presets'

describe('QuickPresets', () => {
  const defaultProps = {
    currentWorkDuration: 25 * 60,
    currentShortBreakDuration: 5 * 60,
    currentLongBreakDuration: 15 * 60,
    onPresetSelect: vi.fn(),
  }

  describe('Work Session', () => {
    it('should render 4 preset buttons for work session', () => {
      render(<QuickPresets {...defaultProps} currentSessionType="work" />)

      expect(screen.getByRole('button', { name: '5 min' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10 min' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '15 min' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '25 min' })).toBeInTheDocument()
    })

    it('should highlight the currently active work duration preset', () => {
      render(<QuickPresets {...defaultProps} currentSessionType="work" currentWorkDuration={10 * 60} />)

      const tenMinButton = screen.getByRole('button', { name: '10 min' })
      const fiveMinButton = screen.getByRole('button', { name: '5 min' })

      // Active button should have default variant (bg-primary)
      expect(tenMinButton.className).toContain('bg-primary')
      // Inactive button should have outline variant (border border-input)
      expect(fiveMinButton.className).toContain('border-input')
    })

    it('should call onPresetSelect with correct duration and session type for work', async () => {
      const user = userEvent.setup()
      const onPresetSelect = vi.fn()
      render(<QuickPresets {...defaultProps} currentSessionType="work" onPresetSelect={onPresetSelect} />)

      await user.click(screen.getByRole('button', { name: '15 min' }))

      expect(onPresetSelect).toHaveBeenCalledWith(15, 'work')
    })

    it('should handle all work preset clicks correctly', async () => {
      const user = userEvent.setup()
      const onPresetSelect = vi.fn()
      render(<QuickPresets {...defaultProps} currentSessionType="work" onPresetSelect={onPresetSelect} />)

      await user.click(screen.getByRole('button', { name: '5 min' }))
      expect(onPresetSelect).toHaveBeenCalledWith(5, 'work')

      await user.click(screen.getByRole('button', { name: '10 min' }))
      expect(onPresetSelect).toHaveBeenCalledWith(10, 'work')

      await user.click(screen.getByRole('button', { name: '25 min' }))
      expect(onPresetSelect).toHaveBeenCalledWith(25, 'work')

      expect(onPresetSelect).toHaveBeenCalledTimes(3)
    })
  })

  describe('Short Break Session', () => {
    it('should render 3 preset buttons for short break session', () => {
      render(<QuickPresets {...defaultProps} currentSessionType="short-break" />)

      expect(screen.getByRole('button', { name: '5 min' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10 min' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '15 min' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '25 min' })).not.toBeInTheDocument()
    })

    it('should highlight the currently active short break duration preset', () => {
      render(
        <QuickPresets {...defaultProps} currentSessionType="short-break" currentShortBreakDuration={10 * 60} />
      )

      const tenMinButton = screen.getByRole('button', { name: '10 min' })
      const fiveMinButton = screen.getByRole('button', { name: '5 min' })

      expect(tenMinButton.className).toContain('bg-primary')
      expect(fiveMinButton.className).toContain('border-input')
    })

    it('should call onPresetSelect with correct duration and session type for short break', async () => {
      const user = userEvent.setup()
      const onPresetSelect = vi.fn()
      render(<QuickPresets {...defaultProps} currentSessionType="short-break" onPresetSelect={onPresetSelect} />)

      await user.click(screen.getByRole('button', { name: '10 min' }))

      expect(onPresetSelect).toHaveBeenCalledWith(10, 'short-break')
    })
  })

  describe('Long Break Session', () => {
    it('should render 3 preset buttons for long break session', () => {
      render(<QuickPresets {...defaultProps} currentSessionType="long-break" />)

      expect(screen.getByRole('button', { name: '5 min' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '10 min' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '15 min' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '25 min' })).not.toBeInTheDocument()
    })

    it('should highlight the currently active long break duration preset', () => {
      render(<QuickPresets {...defaultProps} currentSessionType="long-break" currentLongBreakDuration={15 * 60} />)

      const fifteenMinButton = screen.getByRole('button', { name: '15 min' })
      const fiveMinButton = screen.getByRole('button', { name: '5 min' })

      expect(fifteenMinButton.className).toContain('bg-primary')
      expect(fiveMinButton.className).toContain('border-input')
    })

    it('should call onPresetSelect with correct duration and session type for long break', async () => {
      const user = userEvent.setup()
      const onPresetSelect = vi.fn()
      render(<QuickPresets {...defaultProps} currentSessionType="long-break" onPresetSelect={onPresetSelect} />)

      await user.click(screen.getByRole('button', { name: '15 min' }))

      expect(onPresetSelect).toHaveBeenCalledWith(15, 'long-break')
    })
  })

  describe('Disabled State', () => {
    it('should disable all buttons when disabled prop is true', () => {
      render(<QuickPresets {...defaultProps} currentSessionType="work" disabled={true} />)

      expect(screen.getByRole('button', { name: '5 min' })).toBeDisabled()
      expect(screen.getByRole('button', { name: '10 min' })).toBeDisabled()
      expect(screen.getByRole('button', { name: '15 min' })).toBeDisabled()
      expect(screen.getByRole('button', { name: '25 min' })).toBeDisabled()
    })

    it('should not call onPresetSelect when button is disabled', async () => {
      const user = userEvent.setup()
      const onPresetSelect = vi.fn()
      render(<QuickPresets {...defaultProps} currentSessionType="work" onPresetSelect={onPresetSelect} disabled={true} />)

      await user.click(screen.getByRole('button', { name: '10 min' }))

      expect(onPresetSelect).not.toHaveBeenCalled()
    })
  })

  describe('Duration Highlighting', () => {
    it('should round current duration to nearest minute for highlighting', () => {
      // 10 minutes and 30 seconds should round to 11, so 10 min preset should not be active
      render(<QuickPresets {...defaultProps} currentSessionType="work" currentWorkDuration={10 * 60 + 30} />)

      const tenMinButton = screen.getByRole('button', { name: '10 min' })
      expect(tenMinButton.className).toContain('border-input')
    })

    it('should highlight no preset when current duration does not match any preset', () => {
      render(<QuickPresets {...defaultProps} currentSessionType="work" currentWorkDuration={30 * 60} />)

      expect(screen.getByRole('button', { name: '5 min' }).className).toContain('border-input')
      expect(screen.getByRole('button', { name: '10 min' }).className).toContain('border-input')
      expect(screen.getByRole('button', { name: '15 min' }).className).toContain('border-input')
      expect(screen.getByRole('button', { name: '25 min' }).className).toContain('border-input')
    })
  })
})
