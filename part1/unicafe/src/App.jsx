import { useState } from 'react'
import Title from './components/Title'
import Button from './components/Button'
import Statistics from './components/Statistics'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const calculateAverage = () => {
    if (all === 0) return 0
    return (good - bad) / all
  }

  const calculatePositive = () => {
    if (all === 0) return 0
    return (good / all) * 100
  }

  return (
    <>
      <Title title='Give feedback' />

      <div style={{ display: 'flex', gap: 10 }}>
        <Button onClick={() => setGood(prev => prev + 1)} name='good' />
        <Button onClick={() => setNeutral(prev => prev + 1)} name='neutral' />
        <Button onClick={() => setBad(prev => prev + 1)} name='bad' />
      </div>

      <Title title='Statistics' />

      <Statistics 
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={calculateAverage()}
        positive={calculatePositive()}
      />
    </>
  )
}

export default App