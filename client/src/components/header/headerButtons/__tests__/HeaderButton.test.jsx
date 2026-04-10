import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HeaderButton from '../HeaderButton.jsx'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

describe('HeaderButton', () => {
    beforeEach(() => {
        mockNavigate.mockClear()
    })

    test('click navigates to link', () => {
        render(<HeaderButton title="Go" link="/profile" />)
        fireEvent.click(screen.getByRole('button', { name: 'Go' }))
        expect(mockNavigate).toHaveBeenCalledWith('/profile')
    })
})
