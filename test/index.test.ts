import { describe, expect, it } from 'vitest'
import { detectColorMode, parseGradient } from '../src/utils'

describe('parseGradient', () => {
  it('should parse linear-gradient with angle and stops', () => {
    const input = 'linear-gradient(90deg, #e7000b 0%, #496adc 100%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.mode).toBe('linear-gradient')
    expect(result?.config.angle).toBe(90)
    expect(result?.config.stops).toHaveLength(2)
    expect(result?.config.stops[0].percentage).toBe(0)
    expect(result?.config.stops[0].color.toHex()).toBe('#e7000b')
    expect(result?.config.stops[1].percentage).toBe(100)
    expect(result?.config.stops[1].color.toHex()).toBe('#496adc')
  })

  it('should parse linear-gradient without angle (default 90deg)', () => {
    const input = 'linear-gradient(#e7000b 0%, #496adc 100%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.mode).toBe('linear-gradient')
    expect(result?.config.angle).toBe(90)
    expect(result?.config.stops).toHaveLength(2)
  })

  it('should parse linear-gradient with different angle', () => {
    const input = 'linear-gradient(45deg, #ff0000 0%, #0000ff 100%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.mode).toBe('linear-gradient')
    expect(result?.config.angle).toBe(45)
    expect(result?.config.stops[0].color.toHex()).toBe('#ff0000')
    expect(result?.config.stops[1].color.toHex()).toBe('#0000ff')
  })

  it('should parse linear-gradient with multiple stops', () => {
    const input = 'linear-gradient(90deg, #ff0000 0%, #00ff00 50%, #0000ff 100%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.config.stops).toHaveLength(3)
    expect(result?.config.stops[0].percentage).toBe(0)
    expect(result?.config.stops[1].percentage).toBe(50)
    expect(result?.config.stops[2].percentage).toBe(100)
  })

  it('should parse linear-gradient with stops without percentage', () => {
    const input = 'linear-gradient(90deg, #ff0000, #0000ff)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.config.stops).toHaveLength(2)
    expect(result?.config.stops[0].percentage).toBe(0)
    expect(result?.config.stops[1].percentage).toBe(100)
    expect(result?.config.stops[0].color.toHex()).toBe('#ff0000')
    expect(result?.config.stops[1].color.toHex()).toBe('#0000ff')
  })

  it('should parse radial-gradient', () => {
    const input = 'radial-gradient(circle at 50% 50%, #e7000b 0%, #496adc 100%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.mode).toBe('radial-gradient')
    expect(result?.config.positionX).toBe(50)
    expect(result?.config.positionY).toBe(50)
    expect(result?.config.stops).toHaveLength(2)
  })

  it('should handle gradient with semicolon', () => {
    const input = 'linear-gradient(90deg, #e7000b 0%, #496adc 100%);'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.mode).toBe('linear-gradient')
  })

  it('should return null for invalid gradient', () => {
    expect(parseGradient('')).toBeNull()
    expect(parseGradient('invalid')).toBeNull()
    expect(parseGradient('linear-gradient()')).toBeNull()
  })

  it('should parse and round-trip gradient correctly', () => {
    const input = 'linear-gradient(90deg, #e7000b 0%, #496adc 100%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    if (result) {
      // Simulate generation (as done in index.vue)
      const stops = result.config.stops
        .sort((a, b) => a.percentage - b.percentage)
        .map(stop => `${stop.color.toHex()} ${stop.percentage}%`)
        .join(', ')
      const generated = `linear-gradient(${result.config.angle}deg, ${stops})`

      expect(generated).toBe(input)
    }
  })

  it('should parse RGB color format in gradient', () => {
    const input = 'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.config.stops).toHaveLength(2)
    expect(result?.config.stops[0].color.toHex()).toBe('#ff0000')
    expect(result?.config.stops[1].color.toHex()).toBe('#0000ff')
  })

  it('should parse HSL color format in gradient', () => {
    const input = 'linear-gradient(90deg, hsl(0, 100%, 50%) 0%, hsl(240, 100%, 50%) 100%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.config.stops).toHaveLength(2)
  })

  it('should handle gradient with whitespace', () => {
    const input = 'linear-gradient( 90deg , #e7000b 0% , #496adc 100% )'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.config.angle).toBe(90)
    expect(result?.config.stops).toHaveLength(2)
  })

  it('should parse gradient with stops in different order', () => {
    const input = 'linear-gradient(90deg, #496adc 100%, #e7000b 0%)'
    const result = parseGradient(input)

    expect(result).not.toBeNull()
    expect(result?.config.stops).toHaveLength(2)
    // Should preserve the order as parsed, not sorted
    expect(result?.config.stops[0].percentage).toBe(100)
    expect(result?.config.stops[1].percentage).toBe(0)
  })
})

describe('detectColorMode', () => {
  it('should detect linear-gradient', () => {
    expect(detectColorMode('linear-gradient(90deg, red, blue)')).toBe('linear-gradient')
  })

  it('should detect radial-gradient', () => {
    expect(detectColorMode('radial-gradient(circle at 50% 50%, red, blue)')).toBe('radial-gradient')
  })

  it('should detect monochrome for non-gradient values', () => {
    expect(detectColorMode('#ff0000')).toBe('monochrome')
    expect(detectColorMode('rgb(255, 0, 0)')).toBe('monochrome')
    expect(detectColorMode('')).toBe('monochrome')
  })
})
