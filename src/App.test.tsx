import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the pomodoro timer', () => {
    render(<App />)
    expect(screen.getByText('Pomodoro Timer')).toBeInTheDocument()
  })

  it('renders the timer display', () => {
    render(<App />)
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByText('Focus Time')).toBeInTheDocument()
  })

  it('renders timer controls', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('renders session info', () => {
    render(<App />)
    expect(screen.getByText(/completed today/i)).toBeInTheDocument()
  })
})
