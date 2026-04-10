import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BackButton from '../BackButton.jsx'

test('calls functionToCall when clicked', () => {
    const fn = jest.fn()
    render(<BackButton functionToCall={fn} />)
    fireEvent.click(screen.getByRole('img', { name: /back button/i }))
    expect(fn).toHaveBeenCalledTimes(1)
})