import { useState } from 'react'
import { anecdotes } from './data/anecdotes'

const App = () => {

  const defaultSelected = () => Math.floor(Math.random() * anecdotes.length)  

  const [selected, setSelected] = useState(defaultSelected)
  const [votes, setVotes] = useState(() => Array(anecdotes.length).fill(0))

  const handleNext = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const handleVote = () => {
    setVotes(votes.map((v, i) => i === selected ? v + 1 : v))
  }

  const maxVotes = Math.max(...votes)
  const topAnecdoteIndex = votes.indexOf(maxVotes)

  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      {maxVotes > 0 ? (
        <>
          <p>{anecdotes[topAnecdoteIndex]}</p>
          <p>has {maxVotes} votes</p>
        </>
      ) : (
        <p>No votes yet</p>
      )}
    </>
  )
}

export default App