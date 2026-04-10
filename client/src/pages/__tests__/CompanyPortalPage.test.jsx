import React from 'react'
import { render, screen } from '@testing-library/react'
import CompanyPortalPage from "../CompanyPortalPage.jsx"

jest.mock('../../components/header/Header.jsx', () => () => <div>Mock Header</div>)
jest.mock('../../components/company-portal/CompanyPortal.jsx', () => () => <div>Mock CompanyPortal</div>)

test('renders header and company portal', () => {
    render(<CompanyPortalPage />)
    expect(screen.getByText('Mock Header')).toBeInTheDocument()
    expect(screen.getByText('Mock CompanyPortal')).toBeInTheDocument()
})