import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ChoseLoginType from '../login/ChoseLoginType.jsx'

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

test('uses login title and register link', () => {
    render(
        <MemoryRouter initialEntries={['/Login']}>
            <ChoseLoginType />
        </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /logging in as an/i })).toBeInTheDocument()
    expect(screen.getByRole('link', {name: /don't have an account/i})).toHaveAttribute('href', '/register')
})