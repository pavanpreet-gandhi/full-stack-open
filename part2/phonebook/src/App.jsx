import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({ person }) => {
  return <p>{person.name}: {person.number}</p>
}

const Persons = ({ persons }) => {
  return (
    <>
      {persons.map(person => <Person key={person.name} person={person} />)}
    </>
  )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} type='text' placeholder="Enter name..." />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} type='tel' placeholder="Enter phone number" />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ filter, handleFilterChange}) => {
  return <input value={filter} onChange={handleFilterChange} placeholder="Filter names..." />
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect invoked')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name.toLowerCase() === newPerson.name.toLowerCase())) {
      alert(`${newPerson.name} is already added to phonebook`)
    } else if (newPerson.name === '' || newPerson.number === '') {
      alert('Name or number cannot be empty')
    } else {
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNumber('')
      console.log('Added', newPerson)
    }
  }

  let filteredPersons = []
  if (filter === '') {
    filteredPersons = persons
  } else {
    console.log('Filter applied, showing persons matching:', filter)
    filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App