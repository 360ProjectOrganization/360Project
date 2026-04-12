import React from 'react'
import { render } from '@testing-library/react'
import BarChart from '../AnalyticsCharts/BarChart.jsx'

const mockBar = jest.fn(() => null)
jest.mock('react-chartjs-2', () => ({
  Bar: (props) => mockBar(props),
}))

describe('BarChart', () => {
  beforeEach(() => {
    mockBar.mockClear()
  })

  test('passes sorted labels and datasets to Bar', () => {
    const data = {
      jobPostingsByDate: [
        { date: '2026-01-02', count: 5 },
        { date: '2026-01-01', count: 2 },
      ],
    }
    const xAxisLabels = ['2026-01-01', '2026-01-02']

    render(
      <BarChart barTitle="Job Postings" data={data} xAxisLabels={xAxisLabels} dataNames={['Job Postings Created']} />
    )

    const { data: passedData } = mockBar.mock.calls[mockBar.mock.calls.length - 1][0]
    expect(passedData.labels).toEqual(['2026-01-01', '2026-01-02'])
    expect(passedData.datasets[0].label).toBe('Job Postings Created')
    expect(passedData.datasets[0].data).toEqual([2, 5])
  })

  test('fills missing dates with 0', () => {
    const data = {
      jobPostingsByDate: [
        { date: '2026-01-02', count: 5 },
      ],
    }
    const xAxisLabels = ['2026-01-01', '2026-01-02']

    render(
      <BarChart barTitle="Job Postings" data={data} xAxisLabels={xAxisLabels} dataNames={['Job Postings Created']} />
    )

    const { data: passedData } = mockBar.mock.calls[mockBar.mock.calls.length - 1][0]
    expect(passedData.labels).toEqual(['2026-01-01', '2026-01-02'])
    expect(passedData.datasets[0].data).toEqual([0, 5])
  })

  test('hides all but first dataset when multiple series provided', () => {
    const data = {
      numUsersByDate: [{ date: '2026-01-01', count: 2 }],
      adminAccountsByDate: [{ date: '2026-01-01', count: 1 }],
    }
    const xAxisLabels = ['2026-01-01']

    render(
      <BarChart barTitle="Users" data={data} xAxisLabels={xAxisLabels} dataNames={['All', 'Admins']} />
    )

    const { data: passedData } = mockBar.mock.calls[mockBar.mock.calls.length - 1][0]
    expect(passedData.datasets).toHaveLength(2)
    expect(passedData.datasets[0].hidden).toBe(false)
    expect(passedData.datasets[1].hidden).toBe(true)
  })
})