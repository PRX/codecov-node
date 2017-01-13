/* global describe, it, expect */
import send from './send'

describe('send', () => {
  it('should have a method `send`', () => {
    expect(typeof send).toBe('function')
  })

  it('should be a promise', () => {
    const s = send()
    expect(typeof s.then).toBe('function')
  })
})
