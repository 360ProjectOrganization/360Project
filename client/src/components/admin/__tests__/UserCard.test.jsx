import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import UserCard from '../UserCard.jsx'

function setup(overrides = {}) {
    const props = {
        id: 'u1',
        name: 'Katniss Everdeen',
        type: 'applicant',
        status: 'active',
        email: 'katniss@example.com',
        deleteUser: jest.fn(),
        xButtonSwitch: jest.fn(),
        setEditAccountInfo: jest.fn(),
        updateStatus: jest.fn(),
        ...overrides,
    }

    render(<UserCard {...props} />)
    return props
}

describe('UserCard', () => {
    test('renders name, type, and email', () => {
        setup()
        expect(screen.getByText('Katniss Everdeen')).toBeInTheDocument()
        expect(screen.getByText('Type: applicant')).toBeInTheDocument()
        expect(screen.getByText('Email: katniss@example.com')).toBeInTheDocument()
    })

    test('changing status calls updateStatus(id, type, newStatus)', () => {
        const s = setup({ status: 'active' })
        const card = screen.getByText('Katniss Everdeen').closest('section')
        const select = within(card).getByRole('combobox')

        fireEvent.change(select, { target: { value: 'inactive' } })

        expect(s.updateStatus).toHaveBeenCalledWith('u1', 'applicant', 'inactive')
    })

    test('clicking Edit sets edit info and toggles modal', () => {
        const s = setup()
        fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

        expect(s.setEditAccountInfo).toHaveBeenCalledWith({
            id: 'u1',
            name: 'Katniss Everdeen',
            type: 'applicant',
            email: 'katniss@example.com',
        })
        expect(s.xButtonSwitch).toHaveBeenCalledTimes(1)
    })

    test('clicking Delete calls deleteUser', () => {
        const s = setup()
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
        expect(s.deleteUser).toHaveBeenCalledWith('u1', 'applicant')
    })
})