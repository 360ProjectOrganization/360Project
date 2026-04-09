import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import HomeSearchBar from '../HomeSearchBar.jsx'

function setup(overrides = {}) {
    const props = {
        role: '',
        titleQuery: '',
        setTitleQuery: jest.fn(),
        locationQuery: '',
        setLocationQuery: jest.fn(),
        selectedTag: '',
        setSelectedTag: jest.fn(),
        appliedFilter: 'all',
        setAppliedFilter: jest.fn(),
        dateSort: 'newest',
        setDateSort: jest.fn(),
        tags: ['React', 'Node'],
        ...overrides,
    }
    const view = render(<HomeSearchBar {...props} />)
    return { ...props, ...view }
}

function getJobsSelect() {
    const section = screen.getByText('Jobs').closest('section')
    return within(section).getByRole('combobox')
}

describe('HomeSearchBar', () => {
    test('typing search and location calls setters', () => {
        const s = setup()
        fireEvent.change(screen.getByPlaceholderText('Job title'), { target: { value: 'dev' } })
        fireEvent.change(screen.getByPlaceholderText('City, remote, hybrid'), { target: { value: 'remote' }, })

        expect(s.setTitleQuery).toHaveBeenCalledWith('dev')
        expect(s.setLocationQuery).toHaveBeenCalledWith('remote')
    })

    test('tag and date sort changes call setters', () => {
        const s = setup()
        fireEvent.change(document.querySelector('select[name="tags"]'), { target: { value: 'React' } })
        expect(s.setSelectedTag).toHaveBeenCalledWith('React')

        fireEvent.change(within(screen.getByText('Posted').closest('section')).getByRole('combobox'), { target: { value: 'oldest' } })
        expect(s.setDateSort).toHaveBeenCalledWith('oldest')
    })

    test('Clear filters resets all filter setters', () => {
        const s = setup({titleQuery: 'x', locationQuery: 'y', selectedTag: 'React', appliedFilter: 'applied', dateSort: 'oldest'})
        fireEvent.click(screen.getByRole('button', { name: /clear filters/i }))
        expect(s.setTitleQuery).toHaveBeenCalledWith('')
        expect(s.setLocationQuery).toHaveBeenCalledWith('')
        expect(s.setSelectedTag).toHaveBeenCalledWith('')
        expect(s.setAppliedFilter).toHaveBeenCalledWith('all')
        expect(s.setDateSort).toHaveBeenCalledWith('newest')
    })

    test('hides Jobs filter for administrator', () => {
        setup({ role: 'administrator' })
        expect(screen.queryByText('Jobs')).not.toBeInTheDocument()
    })

    test('shows Applied / Not applied for applicant', () => {
        setup({ role: 'applicant' })
        expect(within(getJobsSelect()).getByRole('option', { name: 'Applied' })).toBeInTheDocument()
        expect(within(getJobsSelect()).getByRole('option', { name: 'Not applied' })).toBeInTheDocument()
    })

    test('shows My jobs / Other jobs for company', () => {
        setup({ role: 'company' })
        expect(within(getJobsSelect()).getByRole('option', { name: 'My jobs' })).toBeInTheDocument()
        expect(within(getJobsSelect()).getByRole('option', { name: 'Other jobs' })).toBeInTheDocument()
    })
})