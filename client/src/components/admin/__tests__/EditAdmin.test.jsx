import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditAdmin from '../EditAdmin.jsx'
import { adminApi } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    adminApi: { editUser: jest.fn() },
}))

function setup(overrides = {}) {
    const props = {
        setXButton: jest.fn(),
        userDetails: {
            id: 't1',
            name: 'Howard Shore',
            email: 'howard@music.com',
            type: 'admin',
        },
        allCards: [],
        setAllCards: jest.fn(),
        setFilteredCards: jest.fn(),
        ...overrides,
    }

    render(<EditAdmin {...props} />)
    return props
}

describe('EditAdmin', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        adminApi.editUser.mockResolvedValue({ok: true})
    })

    test('clicking X calls setXButton', () => {
        const s = setup()
        fireEvent.click(screen.getByText('X'))
        expect(s.setXButton).toHaveBeenCalledTimes(1)
    })

    test('submitting valid values calls adminApi.editUser w payload', async () => {
        setup()
        fireEvent.change(screen.getByDisplayValue('Howard Shore'), { target: { value: 'Howard Shore' } })
        fireEvent.change(screen.getByDisplayValue('howard@music.com'), { target: { value: 'howard@music.com' } })
        
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
        
        await waitFor(() => {
            expect(adminApi.editUser).toHaveBeenCalledWith('t1', {
                role: 'admin',
                name: 'Howard Shore',
                email: 'howard@music.com',
                password: '',
            })
        })
    })

    test('does not call API when validation fails', async () => {
        setup()

        fireEvent.change(screen.getByDisplayValue('Howard Shore'), { target: { value: '' } })
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
        await waitFor(() => {
            expect(screen.getByText(/required|enter first and last name/i)).toBeInTheDocument()
        })

        expect(adminApi.editUser).not.toHaveBeenCalled()
    })

})