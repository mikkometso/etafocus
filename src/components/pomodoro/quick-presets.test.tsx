import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickPresets } from './quick-presets'

describe('QuickPresets', () => {
  it('should render all preset buttons', () => {
    const onPresetSelect = vi.fn()
    render(<QuickPresets currentWorkDuration={25 * 60} onPresetSelect={onPresetSelect} />)

    expect(screen.getByRole('button', { name: '5 min' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '10 min' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '15 min' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '25 min' })).toBeInTheDocument()
  })

  it('should highlight the currently active preset', () => {
    const onPresetSelect = vi.fn()
    render(<QuickPresets currentWorkDuration={10 * 60} onPresetSelect={onPresetSelect} />)

    const tenMinButton = screen.getByRole('button', { name: '10 min' })
    const fiveMinButton = screen.getByRole('button', { name: '5 min' })

    // Active button should have default variant (bg-primary)
    expect(tenMinButton.className).toContain('bg-primary')
    // Inactive button should have outline variant (border border-input)
    expect(fiveMinButton.className).toContain('border-input')
  })

  it('should call onPresetSelect with correct duration when preset is clicked', async () => {
    const user = userEvent.setup()
    const onPresetSelect = vi.fn()
    render(<QuickPresets currentWorkDuration={25 * 60} onPresetSelect={onPresetSelect} />)

    await user.click(screen.getByRole('button', { name: '15 min' }))

    expect(onPresetSelect).toHaveBeenCalledWith(15)
  })

  it('should handle all preset clicks correctly', async () => {
    const user = userEvent.setup()
    const onPresetSelect = vi.fn()
    render(<QuickPresets currentWorkDuration={25 * 60} onPresetSelect={onPresetSelect} />)

    await user.click(screen.getByRole('button', { name: '5 min' }))
    expect(onPresetSelect).toHaveBeenCalledWith(5)

    await user.click(screen.getByRole('button', { name: '10 min' }))
    expect(onPresetSelect).toHaveBeenCalledWith(10)

    await user.click(screen.getByRole('button', { name: '15 min' }))
    expect(onPresetSelect).toHaveBeenCalledWith(15)

    expect(onPresetSelect).toHaveBeenCalledTimes(3)
  })

  it('should round current duration to nearest minute for highlighting', () => {
    const onPresetSelect = vi.fn()
    // 10 minutes and 30 seconds should round to 11, so 10 min preset should not be active
    render(<QuickPresets currentWorkDuration={10 * 60 + 30} onPresetSelect={onPresetSelect} />)

    const tenMinButton = screen.getByRole('button', { name: '10 min' })
    // Should not be active because 10.5 minutes rounds to 11
    expect(tenMinButton.className).toContain('border-input')
  })

  it('should highlight no preset when current duration does not match any preset', () => {
    const onPresetSelect = vi.fn()
    render(<QuickPresets currentWorkDuration={30 * 60} onPresetSelect={onPresetSelect} />)

    // All buttons should have outline variant (none active)
    expect(screen.getByRole('button', { name: '5 min' }).className).toContain('border-input')
    expect(screen.getByRole('button', { name: '10 min' }).className).toContain('border-input')
    expect(screen.getByRole('button', { name: '15 min' }).className).toContain('border-input')
    expect(screen.getByRole('button', { name: '25 min' }).className).toContain('border-input')
  })

  it('should disable all buttons when disabled prop is true', () => {
    const onPresetSelect = vi.fn()
    render(<QuickPresets currentWorkDuration={25 * 60} onPresetSelect={onPresetSelect} disabled={true} />)

    expect(screen.getByRole('button', { name: '5 min' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '10 min' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '15 min' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '25 min' })).toBeDisabled()
  })

  it('should not call onPresetSelect when button is disabled', async () => {
    const user = userEvent.setup()
    const onPresetSelect = vi.fn()
    render(<QuickPresets currentWorkDuration={25 * 60} onPresetSelect={onPresetSelect} disabled={true} />)

    await user.click(screen.getByRole('button', { name: '10 min' }))

    expect(onPresetSelect).not.toHaveBeenCalled()
  })
})
