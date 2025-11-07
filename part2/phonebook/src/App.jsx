import { useState } from 'react'

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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  console.log('test')

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
    console.log('attempting to add', newPerson)
    if (persons.some(person => person.name.toLowerCase() === newPerson.name.toLowerCase())) {
      alert(`${newPerson.name} is already added to phonebook`)
    } else if (newPerson.name === '' || newPerson.number === '') {
      alert('Name or number cannot be empty')
    } else {
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNumber('')
    }
  }

  let filteredPersons = []
  if (filter === '') {
    console.log('No filter applied, showing all persons')
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