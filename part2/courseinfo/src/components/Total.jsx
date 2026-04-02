const Total = ({ parts }) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <b>
      Total of {total} exercises
    </b>
  )
}

export default Total