import { filterJobPostings } from '../filterHelper.js'

describe('filterJobPostings', () => {
    const postings = [
        { _id: 'p1', title: 'React Dev', location: 'Remote', tags: ['React'], applicants: ['a1'], companyId: 'c1' },
        { _id: 'p2', title: 'Node Dev', location: 'Vancouver', tags: ['Node'], applicants: [], companyId: 'c2' },
    ]

    test('filters by title and location', () => {
        const result = filterJobPostings(
            postings,
            { titleQuery: 'react', locationQuery: 'remote', selectedTag: '', appliedFilter: 'all' },
            { role: '', id: '' }
        )
        expect(result.map(p => p._id)).toEqual(['p1'])
    })

    test('filters by tag', () => {
        const result = filterJobPostings(
            postings,
            { titleQuery: '', locationQuery: '', selectedTag: 'node', appliedFilter: 'all' },
            { role: '', id: '' }
        )
        expect(result.map(p => p._id)).toEqual(['p2'])
    })

    test('applicant appliedFilter works', () => {
        const applied = filterJobPostings(
            postings,
            { titleQuery: '', locationQuery: '', selectedTag: '', appliedFilter: 'applied' },
            { role: 'applicant', id: 'a1' }
        )
        expect(applied.map(p => p._id)).toEqual(['p1'])

        const notApplied = filterJobPostings(
            postings,
            { titleQuery: '', locationQuery: '', selectedTag: '', appliedFilter: 'not-applied' },
            { role: 'applicant', id: 'a1' }
        )
        expect(notApplied.map(p => p._id)).toEqual(['p2'])
    })

    test('company mine/not-mine works', () => {
        const mine = filterJobPostings(
            postings,
            { titleQuery: '', locationQuery: '', selectedTag: '', appliedFilter: 'mine' },
            { role: 'company', id: 'c1' }
        )
        expect(mine.map(p => p._id)).toEqual(['p1'])

        const notMine = filterJobPostings(
            postings,
            { titleQuery: '', locationQuery: '', selectedTag: '', appliedFilter: 'not-mine' },
            { role: 'company', id: 'c1' }
        )
        expect(notMine.map(p => p._id)).toEqual(['p2'])
    })
})

