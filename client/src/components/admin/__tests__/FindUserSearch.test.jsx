import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FindUserSearch from '../FindUserSearch.jsx'

function setup() {
    const setFilter = jest.fn()
    const setFilterType = jest.fn()
    render(<FindUserSearch setFilter={setFilter} setFilterType={setFilterType} />)
    return { setFilter, setFilterType }
}

describe('FindUserSearch', () => {
    test('renders the search controls', () => {
        setup()
        expect(screen.getByText('Search By:')).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('...')).toBeInTheDocument()
    })

    test('changing filter type calls setFilterType', () => {
        const s = setup()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'type' } })
        expect(s.setFilterType).toHaveBeenCalledWith('type')
    })

    test('typing in search input calls setFilter', () => {
        const s = setup()
        fireEvent.change(screen.getByPlaceholderText('...'), { target: { value: 'alice' } })
        expect(s.setFilter).toHaveBeenCalledWith('alice')
    })
})