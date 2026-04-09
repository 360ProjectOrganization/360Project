import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from "../NotFound.jsx"

test('shows 404 copy and link home', () => {
    render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
    expect(screen.getByText("That page doesn't exist.")).toBeInTheDocument()
    
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/')
})