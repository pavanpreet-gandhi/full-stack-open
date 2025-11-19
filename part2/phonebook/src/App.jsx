import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import peopleService from './services/people'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null})

  useEffect(
    // curly braces ensure the function below does not return the promise but simply calls it
    () => {peopleService.getAll().then(initialPeople => setPersons(initialPeople))},
    []
  )

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
      if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())
        const updatedPerson = { ...personToUpdate, name: newPerson.name, number: newPerson.number }
        peopleService
          .update(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            console.log('Old person', personToUpdate)
            console.log('Updated person', returnedPerson)
            peopleService.getAll().then(updatedPeople => setPersons(updatedPeople))
            setNewName('')
            setNewNumber('')
            setNotification({ message: `Updated ${returnedPerson.name}'s number`, type: 'add' })
            setTimeout(() => {setNotification({ message: null, type: null })}, 2000)
          })
          .catch(error => {
            console.log('Error updating person', error)
            setNotification({ message: error.response.data.error, type: 'error' })
            setTimeout(() => {setNotification({ message: null, type: null })}, 2000)
          })
      }
    } else {
      peopleService
        .create(newPerson)
        .then(returnedPerson => {
          console.log('Created person', returnedPerson)
          peopleService.getAll().then(updatedPeople => setPersons(updatedPeople))
          setNewName('')
          setNewNumber('')
          setNotification({ message: `Added ${returnedPerson.name}`, type: 'add' })
          setTimeout(() => {setNotification({ message: null, type: null })}, 2000)
        })
        .catch(error => {
          console.log('Error creating person', error)
          setNotification({ message: error.response.data.error, type: 'error' })
          setTimeout(() => {setNotification({ message: null, type: null })}, 2000)
        })
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) {
      return;
    }
    peopleService
      .deletePerson(id)
      .then(returnedPerson => {
        console.log('Deleted person', returnedPerson)
        peopleService.getAll().then(updatedPeople => setPersons(updatedPeople))
        setNotification({ message: `Deleted ${returnedPerson.name}`, type: 'delete' })
        setTimeout(() => {setNotification({ message: null, type: null })}, 2000)
      })
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
      <Notification message={notification.message} type={notification.type}/>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete}/>
    </div>
  )
}

export default App
