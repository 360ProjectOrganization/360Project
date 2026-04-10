import React from 'react'
import { render, screen } from '@testing-library/react'
import JobFillRate from '../JobFillRate.jsx'

jest.mock('../AnalyticsCharts/PieChart.jsx', () => ({
    __esModule: true,
    default: ({ pieChartTitle, chartData, chartLabels }) => (
        <div data-testid="pie">
            {pieChartTitle} | {chartData.join(',')} | {chartLabels.join(',')}
        </div>
    ),
}))

test('renders pie chart with title, labels, and data', () => {
    render(<JobFillRate jobFillRate={[3, 4]} />)
    expect(screen.getByTestId('pie')).toHaveTextContent('Job Posting Fill Rate')
    expect(screen.getByTestId('pie')).toHaveTextContent('3,4')
    expect(screen.getByTestId('pie')).toHaveTextContent('Filled Closed Job Posting')
    expect(screen.getByTestId('pie')).toHaveTextContent('Unfilled Closed Job Posting')
})