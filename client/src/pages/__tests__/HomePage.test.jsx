import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from "../HomePage.jsx"

jest.mock('../../components/header/Header.jsx', () => () => <div>Mock Header</div>)
jest.mock('../../components/home/HomeJobPostings.jsx', () => () => (<div>Mock HomeJobPostings</div>))

test('renders header and home job postings section', () => {
    render(<HomePage />)
    expect(screen.getByText('Mock Header')).toBeInTheDocument()
    expect(screen.getByText('Mock HomeJobPostings')).toBeInTheDocument()
})