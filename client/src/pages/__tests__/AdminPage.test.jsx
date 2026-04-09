import React from 'react'
import { render, screen } from '@testing-library/react'
import AdminPage from '../AdminPage.jsx'

jest.mock('../../components/header/Header.jsx', () => () => <div>Mock Header</div>)
jest.mock('../../components/admin/AdminHandler.jsx', () => () => <div>Mock AdminHandler</div>)

test('renders header and admin handler', () => {
    render(<AdminPage />)
    expect(screen.getByText('Mock Header')).toBeInTheDocument()
    expect(screen.getByText('Mock AdminHandler')).toBeInTheDocument()
})