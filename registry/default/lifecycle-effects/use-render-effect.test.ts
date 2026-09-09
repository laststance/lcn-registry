import { renderHook } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'

import { useRenderEffect } from './use-render-effect'

describe('useRenderEffect', () => {
  describe('without a deps argument (fires on every render)', () => {
    test('calls the effect on the initial render (mount)', () => {
      const effect = vi.fn()
      renderHook(() => useRenderEffect(effect))
      expect(effect).toHaveBeenCalledOnce()
    })

    test('calls the effect on every subsequent re-render', () => {
      const effect = vi.fn()
      const { rerender } = renderHook(() => useRenderEffect(effect))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
      rerender()
      expect(effect).toHaveBeenCalledTimes(4)
    })

    test('runs the returned cleanup before the next effect on re-render', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      const { rerender } = renderHook(() => useRenderEffect(effect))

      expect(effect).toHaveBeenCalledTimes(1)
      expect(cleanup).toHaveBeenCalledTimes(0)

      rerender()
      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)

      rerender()
      expect(cleanup).toHaveBeenCalledTimes(2)
      expect(effect).toHaveBeenCalledTimes(3)
    })

    test('runs the cleanup on unmount', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      const { unmount } = renderHook(() => useRenderEffect(effect))

      expect(cleanup).toHaveBeenCalledTimes(0)
      unmount()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })

    test('works without a cleanup function returned from the effect', () => {
      const effect = vi.fn(() => undefined)
      const { rerender, unmount } = renderHook(() => useRenderEffect(effect))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('with a non-empty deps argument (fires on mount + dep changes)', () => {
    test('calls the effect on the initial render with a single dep', () => {
      const effect = vi.fn()
      renderHook(() => useRenderEffect(effect, [0]))
      expect(effect).toHaveBeenCalledOnce()
    })

    test('does not re-fire when the dep value is unchanged across renders', () => {
      const effect = vi.fn()
      const dep = 'stable'
      const { rerender } = renderHook(() => useRenderEffect(effect, [dep]))

      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
    })

    test('re-fires when a single dep changes', () => {
      const effect = vi.fn()
      let dep = 0
      const { rerender } = renderHook(() => useRenderEffect(effect, [dep]))

      expect(effect).toHaveBeenCalledTimes(1)
      dep = 1
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      dep++
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
    })

    test('re-fires when any of multiple deps change', () => {
      const effect = vi.fn()
      let firstDep: { liked: boolean } = { liked: false }
      let secondDep = 0
      const { rerender } = renderHook(() =>
        useRenderEffect(effect, [firstDep, secondDep]),
      )

      expect(effect).toHaveBeenCalledTimes(1)
      firstDep.liked = true
      rerender()
      expect(effect).toHaveBeenCalledTimes(1)
      firstDep = { liked: true }
      rerender()
      expect(effect).toHaveBeenCalledTimes(2)
      secondDep++
      rerender()
      expect(effect).toHaveBeenCalledTimes(3)
    })

    test('runs the cleanup before the next effect when a dep changes', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      let dep = 0
      const { rerender } = renderHook(() => useRenderEffect(effect, [dep]))

      expect(effect).toHaveBeenCalledTimes(1)
      expect(cleanup).toHaveBeenCalledTimes(0)

      dep = 1
      rerender()
      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)

      rerender()
      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)
    })

    test('runs the cleanup on unmount when deps are provided', () => {
      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      const { unmount } = renderHook(() => useRenderEffect(effect, [1, 2]))

      expect(cleanup).toHaveBeenCalledTimes(0)
      unmount()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  })

  describe('type-level rejection of empty deps `[]`', () => {
    test('rejects `[]` at the type level — use `useInitialEffect` for mount-only effects', () => {
      const effect = vi.fn()
      renderHook(() =>
        // @ts-expect-error - useRenderEffect intentionally rejects `[]`. Use `useInitialEffect` for mount-only behavior.
        useRenderEffect(effect, []),
      )
      expect(effect).toHaveBeenCalledOnce()
    })
  })
})
