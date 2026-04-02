const Persons = ({ personsToShow, handleDelete }) => {
    return (
      <>
          {personsToShow.map((p) => (
            <div key={p.name}>{p.name} - {p.number} <button onClick={() => handleDelete(p.id)}>delete</button></div>
          ))}
      </>
    )
}

export default Persons