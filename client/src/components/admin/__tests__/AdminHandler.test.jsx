import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminHandler from '../AdminHandler.jsx'

function renderAdminHandler(initialEntry = '/Admin') {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <AdminHandler />
        </MemoryRouter>
    )
}

jest.mock('../FindUsers', () => ({
    __esModule: true,
    default: function MockFindUsers(props) {
        const { useEffect } = require('react')
        useEffect(() => {
            props.setLoading(false)
        }, [props.setLoading])
        return <div data-testid="mock-find-users">Mock FindUsers</div>
    },
}))

jest.mock('../CreateNewAdminForm', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-new-admin">Mock CreateNewAdminForm</div>
}))

jest.mock('../Analytics/Analytics', () => ({
    __esModule: true,
    default: ({ whichAnalyticsData }) => (
        <div data-testid="mock-analytics">{whichAnalyticsData}</div>
    )
}))

function getMainPageSelect() {
    return screen.getAllByRole('combobox')[0] // should be the right select?
}

describe('AdminHandler', () => {
    test('starts on Find Users, after load it shows FindUserSearch and FindUsers', async () => {
        renderAdminHandler()
        expect(screen.getByRole('heading', { name: 'Admin Portal' })).toBeInTheDocument()
        expect(screen.getByTestId('mock-find-users')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('Search By:')).toBeInTheDocument() // in FindUserSearch
        })
    })

    test('switching to New Admin shows CreateNewAdminForm and hides FindUsers', async () => {
        renderAdminHandler()
        await waitFor(() => expect(screen.getByText('Search By:')).toBeInTheDocument()) // in FindUserSearch

        fireEvent.change(getMainPageSelect(), { target: { value: 'New Admin' } })
        
        expect(screen.queryByTestId('mock-find-users')).not.toBeInTheDocument()
        expect(screen.getByTestId('mock-new-admin')).toBeInTheDocument()
    })

    test('Analytics page shows data selector and Analytics with default jobPostings state', async () => {
        renderAdminHandler()
        await waitFor(() => expect(screen.getByText('Search By:')).toBeInTheDocument())

        fireEvent.change(getMainPageSelect(), { target: { value: 'Analytics' } })

        expect(screen.getByText('Select Analytics Data:')).toBeInTheDocument()
        expect(screen.getByTestId('mock-analytics')).toHaveTextContent('jobPostings')
    })

    test('Analytics sleect updated whichAnalyticsData is passed to Analytics', async () => {
        renderAdminHandler()
        await waitFor(() => expect(screen.getByText('Search By:')).toBeInTheDocument())

        fireEvent.change(getMainPageSelect(), { target: { value: 'Analytics' } }) // setting to Analytics page
        
        const analyticsSelect = screen.getAllByRole('combobox')[1]
        
        fireEvent.change(analyticsSelect, { target: { value: 'numUsers' } })
        expect(screen.getByTestId('mock-analytics')).toHaveTextContent('numUsers')
    })
})
