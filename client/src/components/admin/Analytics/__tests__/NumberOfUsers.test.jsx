import React from 'react'
import { render, screen } from '@testing-library/react'
import NumberOfUsers from '../NumberOfUsers.jsx'

jest.mock('../AnalyticsCharts/BarChart.jsx', () => ({
    __esModule: true,
    default: ({ barTitle, xAxisLabels, dataNames }) => (
        <div data-testid="bar">
            {barTitle} | labels:{xAxisLabels.length} | names:{dataNames.join(',')}
        </div>
    ),
}))

test('renders stat card and bar chart with series names', () => {
    const usersByDate = {
        numUsersByDate: [{ date: '2026-01-01', count: 2 }],
        adminAccountsByDate: [],
        companyAccountsByDate: [],
        applicantAccountsByDate: [],
    }

    render(<NumberOfUsers usersByDate={usersByDate} numUsers={42} />)

    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByTestId('bar')).toHaveTextContent('Number of Users')
    expect(screen.getByTestId('bar')).toHaveTextContent('Number of All Users')
    expect(screen.getByTestId('bar')).toHaveTextContent('Admin Accounts')
    expect(screen.getByTestId('bar')).toHaveTextContent('Company Accounts')
    expect(screen.getByTestId('bar')).toHaveTextContent('Applicant Accounts')
})