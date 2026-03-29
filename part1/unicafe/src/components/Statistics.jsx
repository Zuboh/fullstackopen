// Statistics.js
import StatisticLine from "./StatisticsLine"

const Statistics = ({ good, neutral, bad, all, average, positive }) => {

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average.toFixed(2)} />
        <StatisticLine text="positive" value={positive.toFixed(2)} />
      </tbody>
    </table>
  )
}

export default Statistics