import React from 'react'
import { render, screen } from '@testing-library/react'
import LoginPage from "../LoginPage.jsx"

jest.mock('../../components/header/Header.jsx', () => () => <div>Mock Header</div>)
jest.mock('../../components/auth/login/ChoseLoginType.jsx', () => () => (<div>Mock ChoseLoginType</div>))

test('renders header and login type chooser', () => {
    render(<LoginPage />)
    expect(screen.getByText('Mock Header')).toBeInTheDocument()
    expect(screen.getByText('Mock ChoseLoginType')).toBeInTheDocument()
})