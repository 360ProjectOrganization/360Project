import React from 'react'
import { render, screen } from '@testing-library/react'
import JobPostings from '../JobPostings.jsx'

jest.mock('../AnalyticsCharts/BarChart.jsx', () => ({
    __esModule: true,
    default: ({ barTitle, xAxisLabels, dataNames }) => (
        <div data-testid="bar">
            {barTitle} | labels:{xAxisLabels.length} | names:{dataNames.join(',')}
        </div>
    ),
}))

test('renders stat card and bar chart props', () => {
    const jobPostingsByDate = { jobPostingsByDate: [{ date: '2026-01-01', count: 2 }] }
    
    render(<JobPostings jobPostingsByDate={jobPostingsByDate} numJobPostings={7} />)

    expect(screen.getByText('Total Job Postings')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByTestId('bar')).toHaveTextContent('Job Postings')
    expect(screen.getByTestId('bar')).toHaveTextContent('Job Postings Created')
})