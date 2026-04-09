import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ChooseRegisterType from '../register/ChooseRegisterType.jsx'

jest.mock('../ChooseUserTypeFlow.jsx', () => ({
    __esModule: true,
    default: function MockFlow({ titleText, bottomButton, footer }) {
        return (
            <div>
                <h2>{titleText}</h2>
                {bottomButton}
                {typeof footer === 'function' ? footer(() => { }) : footer}
            </div>
        )
    },
}))

test('uses register title and login link', () => {
    render(
        <MemoryRouter initialEntries={['/register']}>
            <ChooseRegisterType />
        </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /registering as an/i })).toBeInTheDocument()
    expect(screen.getByRole('link', {name: /already have an account/i})).toHaveAttribute('href', '/Login')
})