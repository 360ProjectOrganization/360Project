import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import FindUsers from '../FindUsers.jsx'
import { adminApi, applicantApi, companyApi, getAuthUser } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    adminApi: { getAllAdmins: jest.fn(), changeUserStatus: jest.fn(), deleteAdmin: jest.fn() },
    applicantApi: { getAll: jest.fn(), deleteAccount: jest.fn() },
    companyApi: {getAll: jest.fn(), deleteAccount: jest.fn() },
    getAuthUser: jest.fn()
}))

function setup(overrides = {}) {
    const { loading: initialLoading = true, setLoading: _omit, ...restOverrides } = overrides
    const props = {
        filterType: 'name',
        filter: '',
        ...restOverrides,
    }

    function Wrapper() {
        const [loading, setLoading] = React.useState(initialLoading)
        return <FindUsers {...props} loading={loading} setLoading={setLoading} />
    }

    render(<Wrapper />)
    return props
}

describe('FindUsers', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        getAuthUser.mockReturnValue({ _id: 'self' })
        
        applicantApi.getAll.mockResolvedValue([
            { _id: 'self', name: 'Me User', email: 'me@example.com', status: 'active' },
            { _id: 'a1', name: 'Frodo Baggins', email: 'baggins@lotr.com', status: 'active' },
        ])
        companyApi.getAll.mockResolvedValue([
            { _id: 'c1', name: 'The Shire', email: 'shire@lotr.com', status: 'inactive'},
        ])
        adminApi.getAllAdmins.mockResolvedValue([
            { _id: 'ad1', name: 'Gandalf Mithrandir', email: 'gandalf@lotr.com', status: 'active'},
        ])
    })

    test('shows loading then renders users (exlcudes authenticated user)', async () => {
        setup()
        expect(screen.getByText(/loading/i)).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
        })

        expect(screen.queryByText('Me User')).not.toBeInTheDocument()
        expect(screen.queryByText('Frodo Baggins')).toBeInTheDocument()
        expect(screen.queryByText('The Shire')).toBeInTheDocument()
        expect(screen.queryByText('Gandalf Mithrandir')).toBeInTheDocument()
    })

    test('changing a user status calls adminApi.changeUserStatus', async () => {
        setup()
        await waitFor(() => {
            expect(screen.getByText('Frodo Baggins')).toBeInTheDocument()
        })

        const card = screen.getByText('Frodo Baggins').closest('section')
        const statusSelect = within(card).getByRole('combobox')
        fireEvent.change(statusSelect, { target: { value: 'inactive' } })
        
        await waitFor(() => {
            expect(adminApi.changeUserStatus).toHaveBeenCalledWith('applicant', 'a1', 'inactive')
        })
    })

    test('deleting a company user calls companyApi.deleteAccount', async () => {
        setup()

        await waitFor(() => {
            expect(screen.getByText('The Shire')).toBeInTheDocument()
        })

        const card = screen.getByText('The Shire').closest('section')
        const delete_btn = within(card).getByRole('button', { name: /delete/i })
        fireEvent.click(delete_btn)

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /are you sure you want to delete/i })).toBeInTheDocument()
        })
        
        fireEvent.click(screen.getByRole('button', { name: /^yes$/i }))

        await waitFor(() => {
            expect(companyApi.deleteAccount).toHaveBeenCalledWith('c1')
        })
    })

    test('shows empty state when filter removes all users', async () => {
        setup({ filterType: 'name', filter: 'bruh' })
        
        await waitFor(() => {
            expect(screen.getByText(/no users match/i)).toBeInTheDocument()
        })
    })
})


