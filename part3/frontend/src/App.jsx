import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/FIlter'
import { useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilerName] = useState('')

  useEffect(() => {
    personService.getAll().then((data) => {
      setPersons(data)
    })
  }, [])

  const addPerson = (e) => {
    e.preventDefault()

    const existingPerson = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added. Replace the old number with a new one?`
      )

      if (!confirmUpdate) return

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService
        .update(existingPerson.id, updatedPerson)
        .then((data) => {
          setPersons(prev =>
            prev.map(p => p.id !== existingPerson.id ? p : data)
          )
        })

      setNewName('')
      setNewNumber('')
      return
    }

    const newPersona = {
      name: newName,
      number: newNumber
    }

    personService.create(newPersona).then((data) => {
      setPersons(prev => [...prev, data])
    })

    setNewName('')
    setNewNumber('')
  }

  const handleChangeName = (e) => {
    setNewName(e.target.value)
  }

  const handleChangeNumber = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilterName = (e) => {
    setFilerName(e.target.value)
  }

  const handleDelete = (id) => {
    if (window.confirm("Do you want to delete this person?")) {
      personService.remove(id).then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
      })
    }
  }

  const personsToShow = persons.filter((p) =>
    p.name.toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={''} />
      <Filter handleFilterName={handleFilterName} filterName={filterName} />
      <h3>Add a new</h3>
      <PersonForm
        add={addPerson}
        handleChangeName={handleChangeName}
        handleChangeNumber={handleChangeNumber}
        newName={newName}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App