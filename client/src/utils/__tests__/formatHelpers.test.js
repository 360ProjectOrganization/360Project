import { getTagColor, formatDate } from '../formatHelpers.js'

describe('getTagColor', () => {
    test('returns deterministic color for same tag', () => {
        const a1 = getTagColor('React')
        const a2 = getTagColor('  react ')
        expect(a1).toEqual(a2)
        expect(a1).toHaveProperty('bg')
        expect(a1).toHaveProperty('text')
    })
})

describe('formatDate', () => {
    test('returns Unknown for invalid date', () => {
        expect(formatDate('not-a-date')).toBe('Unknown')
    })

    test('returns Today for same-day date', () => {
        const now = new Date()
        const out = formatDate(now.toISOString())
        expect(out).toMatch(/^Today at /)
    })
})
