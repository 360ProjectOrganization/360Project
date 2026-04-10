import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CompanyPortalSubNav from '../CompanyPortalSubNav.jsx'

function renderSubNav(ui) {
    return render(<MemoryRouter>{ui}</MemoryRouter>)
}

test('create button calls handler', () => {
    const onCreateClick = jest.fn()

    renderSubNav(<CompanyPortalSubNav onCreateClick={onCreateClick} />)

    fireEvent.click(screen.getByRole('button', { name: /create new job posting/i }))

    expect(onCreateClick).toHaveBeenCalledTimes(1)
})

test('shows page title', () => {
    renderSubNav(<CompanyPortalSubNav onCreateClick={() => {}} />)

    expect(screen.getByRole('heading', { name: /company job postings/i })).toBeInTheDocument()
})
