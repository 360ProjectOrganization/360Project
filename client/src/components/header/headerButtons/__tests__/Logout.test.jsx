import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Logout from '../Logout.jsx'
import { clearToken } from '../../../../utils/api'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

jest.mock('../../../../utils/api', () => ({
    clearToken: jest.fn(),
}))

describe('Logout', () => {
    let consoleErrorSpy

    beforeEach(() => {
        jest.clearAllMocks()
        mockNavigate.mockClear()
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleErrorSpy?.mockRestore()
    })

    test('clears token, navigates home, reloads', () => {
        render(<Logout />)
        fireEvent.click(screen.getByRole('button', { name: /logout/i }))

        expect(clearToken).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith('/')
    })
})