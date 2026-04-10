import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DeletePopup from '../DeletePopup.jsx'

describe('DeletePopup', () => {
    test('renders prompt and buttons', () => {
        render(<DeletePopup deletePopupSwitch={() => {}} deleteFunction={() => {}} />)
        expect(screen.getByRole('heading', { name: /are you sure you want to delete this user/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
    })

    test('Yes triggers deleteFunction and No triggers deletePopupSwitch', () => {
        const deletePopupSwitch = jest.fn()
        const deleteFunction = jest.fn()

        render(<DeletePopup deletePopupSwitch={deletePopupSwitch} deleteFunction={deleteFunction} />)

        fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
        expect(deleteFunction).toHaveBeenCalledTimes(1)

        fireEvent.click(screen.getByRole('button', { name: 'No' }))
        expect(deletePopupSwitch).toHaveBeenCalledTimes(1)
    })
})