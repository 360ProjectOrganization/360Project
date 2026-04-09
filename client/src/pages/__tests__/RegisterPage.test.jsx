import React from 'react'
import { render, screen } from '@testing-library/react'
import RegisterPage from "../RegisterPage.jsx"

jest.mock('../../components/header/Header.jsx', () => () => <div>Mock Header</div>)
jest.mock('../../components/auth/register/ChooseRegisterType.jsx', () => () => (<div>Mock ChooseRegisterType</div>))

test('renders header and register type chooser', () => {
    render(<RegisterPage />)
    expect(screen.getByText('Mock Header')).toBeInTheDocument()
    expect(screen.getByText('Mock ChooseRegisterType')).toBeInTheDocument()
})