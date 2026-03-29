import Part from './Part'

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((p, i) => (
        <Part key={i} part={p.name} exercises={p.exercises} />
      ))}
    </>
  )
}

export default Content