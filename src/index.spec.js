/* global describe, it, expect */
import codecov from './'

describe('Codecov', () => {
  it('should be an object', () => {
    expect(typeof codecov).toBe('object')
  })
})
