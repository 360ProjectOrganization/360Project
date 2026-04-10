import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CompanyPortalSubNav from '../CompanyPortalSubNav.jsx'

test('buttons call handlers', () => {
    const onPostingsClick = jest.fn()
    const onCreateClick = jest.fn()
    const onProfileClick = jest.fn()

    render(
        <CompanyPortalSubNav onPostingsClick={onPostingsClick} onCreateClick={onCreateClick} onProfileClick={onProfileClick} />
    )

    fireEvent.click(screen.getByRole('button', { name: /company job postings/i }))
    fireEvent.click(screen.getByRole('button', { name: /create new job posting/i }))
    fireEvent.click(screen.getByRole('button', { name: /company profile/i }))

    expect(onPostingsClick).toHaveBeenCalledTimes(1)
    expect(onCreateClick).toHaveBeenCalledTimes(1)
    expect(onProfileClick).toHaveBeenCalledTimes(1)
})