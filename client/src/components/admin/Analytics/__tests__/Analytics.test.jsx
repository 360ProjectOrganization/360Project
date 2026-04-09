import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Analytics from '../Analytics.jsx'
import { adminApi } from '../../../../utils/api'

jest.mock('../../../../utils/api', () => ({
    adminApi: { getAllCompanyAnalytics: jest.fn() },
}))

jest.mock('../JobPostings.jsx', () => ({
    __esModule: true,
    default: ({ numJobPostings }) => (
        <div data-testid="job-postings">JobPostings {numJobPostings}</div>
    ),
}))

jest.mock('../NumberOfUsers.jsx', () => ({
    __esModule: true,
    default: ({ numUsers }) => (
        <div data-testid="num-users">NumberOfUsers {numUsers}</div>
    ),
}))

jest.mock('../JobFillRate.jsx', () => ({
    __esModule: true,
    default: ({ jobFillRate }) => (
        <div data-testid="fill-rate">JobFillRate {jobFillRate.join(',')}</div>
    ),
}))

const fakeAnalytics = {
    numJobPostings: 7,
    numUsers: 42,
    jobPostingsByDate: [{ date: '2026-01-01', count: 1 }],
    allAccountsByDate: [{ date: '2026-01-01', count: 2 }],
    adminAccountsByDate: [],
    companyAccountsByDate: [],
    applicantAccountsByDate: [],
    filledJobs: 3,
    unfilledJobs: 4,
}

describe('Analytics', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        adminApi.getAllCompanyAnalytics.mockResolvedValue(fakeAnalytics)
    })

    test('fetches analytics once', async () => {
        render(<Analytics whichAnalyticsData="jobPostings" />)

        await waitFor(() => {
            expect(adminApi.getAllCompanyAnalytics).toHaveBeenCalledTimes(1)
        })
    })

    test('renders JobPostings when whichAnalyticsData=jobPostings', async () => {
        render(<Analytics whichAnalyticsData="jobPostings" />)

        await waitFor(() => {
            expect(screen.getByTestId('job-postings')).toHaveTextContent('JobPostings 7')
        })
        expect(screen.queryByTestId('num-users')).not.toBeInTheDocument()
        expect(screen.queryByTestId('fill-rate')).not.toBeInTheDocument()
    })

    test('renders NumberOfUsers when whichAnalyticsData=numUsers', async () => {
        render(<Analytics whichAnalyticsData="numUsers" />)

        await waitFor(() => {
            expect(screen.getByTestId('num-users')).toHaveTextContent('NumberOfUsers 42')
        })
        expect(screen.queryByTestId('job-postings')).not.toBeInTheDocument()
        expect(screen.queryByTestId('fill-rate')).not.toBeInTheDocument()
    })

    test('renders JobFillRate when whichAnalyticsData=jobFillRate', async () => {
        render(<Analytics whichAnalyticsData="jobFillRate" />)

        await waitFor(() => {
            expect(screen.getByTestId('fill-rate')).toHaveTextContent('JobFillRate 3,4')
        })
        expect(screen.queryByTestId('job-postings')).not.toBeInTheDocument()
        expect(screen.queryByTestId('num-users')).not.toBeInTheDocument()
    })
})