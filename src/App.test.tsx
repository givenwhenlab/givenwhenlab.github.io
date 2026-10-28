import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ScenarioDemo } from './App'

describe('ScenarioDemo', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('runs each illustrative step and shows a Cucumber-style result', () => {
    vi.useFakeTimers()
    render(<ScenarioDemo language="en" />)

    expect(screen.getByText('Ready to illustrate')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(700))
    act(() => vi.advanceTimersByTime(560))
    act(() => vi.advanceTimersByTime(560))
    act(() => vi.advanceTimersByTime(560))

    const result = screen.getByLabelText('Illustrative Cucumber-style result')
    expect(within(result).getByText(/1 scenario/)).toHaveTextContent('1 scenario (1 passed)')
    expect(within(result).getByText(/3 steps/)).toHaveTextContent('3 steps (3 passed)')
  })

  it('restarts the completed illustration', () => {
    vi.useFakeTimers()
    render(<ScenarioDemo language="en" />)

    act(() => vi.advanceTimersByTime(700))
    act(() => vi.advanceTimersByTime(560))
    act(() => vi.advanceTimersByTime(560))
    act(() => vi.advanceTimersByTime(560))
    fireEvent.click(screen.getByRole('button', { name: /run again/i }))

    expect(screen.getByText('Running…')).toBeInTheDocument()
  })
})
